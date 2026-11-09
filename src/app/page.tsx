"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  MessageCircle,
  Heart,
  BookOpen,
} from "lucide-react";
import { db, ready } from "@/lib/db";

type Item = {
  id: number;
  price: number | null;
  available: boolean;
  updated_at: string;
  stores: {
    name: string;
    address: string | null;
    whatsapp: string | null;
  } | null;
  books: {
    title: string;
    author: string | null;
    isbn: string | null;
  } | null;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");
  const [kg, setKg] = useState(false);
  const [fav, setFav] = useState<number[]>([]);
  const [only, setOnly] = useState(false);

  const t = {
    ru: {
      top: "КНИЖНЫЕ МАГАЗИНЫ БИШКЕКА",
      title: "Найди свою следующую книгу.",
      subtitle: "Ищи по названию, автору или ISBN. Сравни предложения магазинов.",
      search: "Название книги, автор или ISBN...",
      available: "Только в наличии",
      catalog: "Предложения магазинов",
      offers: "предложений",
      emptyTitle: "Книги пока не найдены",
      emptyText: "Попробуй другой запрос или загляни позже.",
      author: "Автор не указан",
      address: "Адрес уточните у магазина",
      price: "Цена уточняется",
      inStock: "В наличии",
      notInStock: "Уточнить наличие",
      whatsapp: "Уточнить в WhatsApp",
      noWhatsapp: "WhatsApp не указан",
      updated: "Обновлено",
      footer: "Найди книгу в Бишкеке. Уточни наличие напрямую.",
      admin: "Для магазинов",
      adminPanel: "Панель управления",
      connect: "Подключите Supabase: добавьте переменные окружения в Vercel. Инструкция — в README.",
    },
    kg: {
      top: "БИШКЕКТЕГИ КИТЕП ДҮКӨНДӨРҮ",
      title: "Кийинки китебиңди тап.",
      subtitle: "Китепти аталышы, автору же ISBN боюнча изде. Дүкөндөрдүн сунуштарын салыштыр.",
      search: "Китептин аталышы, автору же ISBN...",
      available: "Бар китептер гана",
      catalog: "Дүкөндөрдүн сунуштары",
      offers: "сунуш",
      emptyTitle: "Китептер азырынча табылган жок",
      emptyText: "Башка сөз менен издеп көр же кийинчерээк кир.",
      author: "Автору көрсөтүлгөн эмес",
      address: "Дарегин дүкөндөн тактаңыз",
      price: "Баасы такталууда",
      inStock: "Бар",
      notInStock: "Бар экенин тактоо",
      whatsapp: "WhatsApp аркылуу тактоо",
      noWhatsapp: "WhatsApp номери көрсөтүлгөн эмес",
      updated: "Жаңыртылды",
      footer: "Китепти Бишкектен тап. Бар экенин түздөн-түз такта.",
      admin: "Дүкөндөр үчүн",
      adminPanel: "Башкаруу панели",
      connect: "Supabase туташтырыңыз: Vercel'ге чөйрө өзгөрмөлөрүн кошуңуз. Нускама README файлында.",
    },
  };

  const lang = kg ? t.kg : t.ru;

  useEffect(() => {
    try {
      setFav(JSON.parse(localStorage.getItem("bookkg-fav") || "[]"));
    } catch {
      setFav([]);
    }

    if (ready) {
      db.from("store_offers")
        .select(
          "id,price,available,updated_at,stores(name,address,whatsapp),books(title,author,isbn)"
        )
        .order("updated_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error) setItems((data || []) as unknown as Item[]);
        });
    }
  }, []);

  const list = items.filter((x) => {
    const text = [
      x.books?.title,
      x.books?.author,
      x.books?.isbn,
      x.stores?.name,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(q.toLowerCase()) && (!only || x.available);
  });

  function favorite(id: number) {
    const next = fav.includes(id)
      ? fav.filter((x) => x !== id)
      : [...fav, id];

    setFav(next);
    localStorage.setItem("bookkg-fav", JSON.stringify(next));
  }

  return (
    <main>
      <header>
        <a className="logo" href="/">
          <b>B</b> BookKG
        </a>

        <nav>
          <button onClick={() => setKg(!kg)}>
            {kg ? "Русский" : "Кыргызча"}
          </button>
          <Link href="/admin">{lang.admin}</Link>
        </nav>
      </header>

      <section className="hero">
        <small>● {lang.top}</small>

        <h1>{lang.title}</h1>

        <p>{lang.subtitle}</p>

        <div className="search">
          <Search />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang.search}
          />
        </div>

        <label className="filter">
          <input
            type="checkbox"
            checked={only}
            onChange={(e) => setOnly(e.target.checked)}
          />
          {lang.available}
        </label>
      </section>

      <section className="catalog">
        <div className="heading">
          <div>
            <small>BOOKKG CATALOG</small>
            <h2>{lang.catalog}</h2>
          </div>

          <span>
            {list.length} {lang.offers}
          </span>
        </div>

        {!ready ? (
          <div className="empty">{lang.connect}</div>
        ) : list.length === 0 ? (
          <div className="empty">
            <BookOpen />
            <b>{lang.emptyTitle}</b>
            <span>{lang.emptyText}</span>
          </div>
        ) : (
          <div className="grid">
            {list.map((x) => (
              <article className="card" key={x.id}>
                <div className="cover">
                  <BookOpen size={35} />
                  <small>BOOKKG</small>
                </div>

                <div className="details">
                  <b className="title">{x.books?.title}</b>

                  <span className="muted">
                    {x.books?.author || lang.author}
                  </span>

                  <b className="shop">{x.stores?.name}</b>

                  <span className="muted">
                    <MapPin size={13} />
                    {x.stores?.address || lang.address}
                  </span>

                  <div className="price">
                    {x.price == null
                      ? lang.price
                      : Number(x.price).toLocaleString(
                          kg ? "ky-KG" : "ru-RU"
                        ) + " сом"}

                    <i className={x.available ? "yes" : ""}>
                      {x.available ? lang.inStock : lang.notInStock}
                    </i>
                  </div>

                  <div className="actions">
                    {x.stores?.whatsapp ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          "https://wa.me/" +
                          String(x.stores.whatsapp).replace(/\D/g, "") +
                          "?text=" +
                          encodeURIComponent(
                            kg
                              ? `Саламатсызбы! «${x.books?.title}» китеби барбы? Азыркы баасы канча?`
                              : `Здравствуйте! Есть ли в наличии книга «${x.books?.title}»? Какая актуальная цена?`
                          )
                        }
                      >
                        <MessageCircle size={16} />
                        {lang.whatsapp}
                      </a>
                    ) : (
                      <span className="muted">{lang.noWhatsapp}</span>
                    )}

                    <button
                      onClick={() => favorite(x.id)}
                      aria-label={
                        fav.includes(x.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        fill={
                          fav.includes(x.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>

                  <small className="date">
                    {lang.updated}:{" "}
                    {new Date(x.updated_at).toLocaleDateString(
                      kg ? "ky-KG" : "ru-RU"
                    )}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        <b>BookKG</b>
        <span>{lang.footer}</span>
        <Link href="/admin">{lang.adminPanel}</Link>
      </footer>
    </main>
  );
}
