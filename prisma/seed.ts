import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 12);
}

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Seedowanie bazy Slavic Fight…");

  // ── Konta ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@slavicfight.pl" },
    update: {},
    create: {
      email: "admin@slavicfight.pl",
      passwordHash: await hash("Admin123!"),
      role: "SUPER_ADMIN",
      firstName: "Super",
      lastName: "Admin",
      profileCompleted: true,
    },
  });

  const trainer = await prisma.user.upsert({
    where: { email: "tomasz@slavicfight.pl" },
    update: {},
    create: {
      email: "tomasz@slavicfight.pl",
      passwordHash: await hash("Trener123!"),
      role: "TRAINER",
      firstName: "Tomasz",
      lastName: "Artym",
      phone: "+48 600 100 200",
      profileCompleted: true,
    },
  });

  // ── Grupy ──────────────────────────────────────────────
  const groupsData = [
    { name: "Początkujący", description: "Podstawy techniki i kondycji. Wejście w boks bez doświadczenia." },
    { name: "Zaawansowani", description: "Sparingi, taktyka i przygotowanie startowe." },
    { name: "Dzieci i młodzież", description: "Sprawność, dyscyplina i pewność siebie w bezpiecznej formie." },
  ];
  const groups: { id: string }[] = [];
  for (const g of groupsData) {
    const existing = await prisma.group.findFirst({ where: { name: g.name } });
    groups.push(
      existing ??
        (await prisma.group.create({ data: { ...g, active: true, createdById: trainer.id } })),
    );
  }

  // ── Podopieczni ────────────────────────────────────────
  const studentsData = [
    { email: "jan@example.com", firstName: "Jan", lastName: "Kowalski", birthYear: 1998, groupIdx: 0 },
    { email: "anna@example.com", firstName: "Anna", lastName: "Nowak", birthYear: 2001, groupIdx: 1 },
    { email: "piotr@example.com", firstName: "Piotr", lastName: "Wiśniewski", birthYear: 1995, groupIdx: 1 },
    { email: "kuba@example.com", firstName: "Kuba", lastName: "Lewandowski", birthYear: 2012, groupIdx: 2 },
  ];
  const students: { id: string }[] = [];
  for (const s of studentsData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        passwordHash: await hash("Haslo123!"),
        role: "STUDENT",
        firstName: s.firstName,
        lastName: s.lastName,
        birthYear: s.birthYear,
        groupId: groups[s.groupIdx].id,
        profileCompleted: true,
      },
    });
    students.push(user);
  }

  // ── Terminarz ──────────────────────────────────────────
  await prisma.event.deleteMany({});
  const today = new Date();
  const at = (daysAhead: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysAhead);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const eventsData = [
    { title: "Trening — Początkujący", date: at(1), startTime: "18:00", endTime: "19:30", groupIdx: [0] },
    { title: "Trening — Zaawansowani", date: at(1), startTime: "19:30", endTime: "21:00", groupIdx: [1] },
    { title: "Zajęcia dzieci i młodzież", date: at(2), startTime: "17:00", endTime: "18:00", groupIdx: [2] },
    { title: "Sparingi (open)", date: at(4), startTime: "18:00", endTime: "20:00", groupIdx: [0, 1] },
    { title: "Trening ogólny — sobota", date: at(5), startTime: "10:00", endTime: "11:30", groupIdx: [0, 1, 2] },
  ];
  for (const e of eventsData) {
    await prisma.event.create({
      data: {
        title: e.title,
        description: "Pamiętaj o stroju sportowym i wodzie.",
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: "Buszkowice 59A",
        createdById: trainer.id,
        groups: { create: e.groupIdx.map((i) => ({ groupId: groups[i].id })) },
      },
    });
  }

  // ── Opinie ─────────────────────────────────────────────
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      { author: "Marek S.", role: "Podopieczny", rating: 5, content: "Najlepszy trener w okolicy. Profesjonalne podejście i mega atmosfera na treningach." },
      { author: "Karolina W.", role: "Podopieczna", rating: 5, content: "Zaczynałam od zera, dziś czuję się pewnie w ringu. Polecam każdemu!" },
      { author: "Tomek (tata Kuby)", role: "Rodzic", rating: 5, content: "Syn rozkwitł — więcej pewności siebie i dyscypliny. Świetne zajęcia dla dzieci." },
    ],
  });

  // ── Treści / Akademia ──────────────────────────────────
  const posts = [
    {
      type: "VIDEO" as const,
      title: "Podstawy postawy bokserskiej",
      excerpt: "Jak ustawić się w gardzie i pracować nogami — pierwszy krok każdego boksera.",
      content: "W tym materiale omawiamy poprawną postawę bokserską, rozkład ciężaru ciała i pracę nóg.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      published: true,
    },
    {
      type: "BLOG" as const,
      title: "5 błędów początkujących bokserów",
      excerpt: "Najczęstsze pomyłki na starcie i jak ich uniknąć.",
      content: "1. Opuszczanie rąk. 2. Brak pracy nóg. 3. Wstrzymywanie oddechu. 4. Zbyt mocne ciosy na treningu techniki. 5. Pomijanie rozgrzewki.",
      published: true,
    },
    {
      type: "NEWS" as const,
      title: "Nowy nabór do grupy początkującej",
      excerpt: "Ruszają zapisy na jesienny nabór.",
      content: "Zapraszamy na pierwszy trening. Liczba miejsc ograniczona — zapisz się przez formularz kontaktowy.",
      published: true,
    },
  ];
  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: slugify(p.title) },
      update: {},
      create: { ...p, slug: slugify(p.title), publishedAt: new Date(), authorId: trainer.id },
    });
  }

  // ── Przykładowa rozmowa (Jan ↔ Tomasz) ─────────────────
  const [a, b] = [students[0].id, trainer.id].sort();
  const convo = await prisma.conversation.upsert({
    where: { participantAId_participantBId: { participantAId: a, participantBId: b } },
    update: {},
    create: { participantAId: a, participantBId: b },
  });
  const count = await prisma.message.count({ where: { conversationId: convo.id } });
  if (count === 0) {
    await prisma.message.create({
      data: { conversationId: convo.id, senderId: students[0].id, body: "Cześć! Czy w piątek są sparingi?" },
    });
    await prisma.message.create({
      data: { conversationId: convo.id, senderId: trainer.id, body: "Hej Jan! Tak, piątek 18:00. Weź ochraniacz na zęby." },
    });
    await prisma.conversation.update({ where: { id: convo.id }, data: { lastMessageAt: new Date() } });
  }

  // ── Zgłoszenia kontaktowe ──────────────────────────────
  const contactCount = await prisma.contactSubmission.count();
  if (contactCount === 0) {
    await prisma.contactSubmission.createMany({
      data: [
        { name: "Adam Malinowski", phone: "601 234 567", email: "adam@example.com", message: "Chciałbym umówić pierwszy trening dla początkujących." },
        { name: "Ewa Zielińska", phone: "602 987 654", message: "Czy prowadzicie zajęcia dla dzieci 8 lat?" },
      ],
    });
  }

  console.log("✅ Gotowe. Konta testowe:");
  console.log("   SUPER_ADMIN: admin@slavicfight.pl / Admin123!");
  console.log("   TRAINER:     tomasz@slavicfight.pl / Trener123!");
  console.log("   STUDENT:     jan@example.com / Haslo123!");
  void admin;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
