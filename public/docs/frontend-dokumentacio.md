# 6. Frontend dokumentáció – Epoch Cinema

---

## 6.1 Projektstruktúra

### Technológiai verem

Az Epoch Cinema frontend alkalmazás modern webes technológiákra épül:

| Technológia | Verzió | Szerep |
|---|---|---|
| React | 19.2.0 | UI könyvtár |
| TypeScript | 5.9.3 | Típusbiztos fejlesztés |
| Vite | 7.2.4 | Build eszköz és fejlesztői szerver |
| Tailwind CSS | 4.1.18 | Utility-first CSS keretrendszer |
| React Router DOM | 7.10.1 | Kliens oldali routing |

### Könyvtárszerkezet

A projekt a feature-alapú (domain-driven) szervezési mintát követi. A forráskód az `src/` mappában található, logikailag elkülönített alkönyvtárakban:

```
src/
├── api/              # API hívások és HTTP kliens
├── assets/           # Statikus erőforrások (képek, favicon)
├── components/       # Újrafelhasználható UI komponensek
│   ├── layout/       #   Navbar, Footer
│   ├── ui/           #   shadcn/Radix UI komponenskönyvtár (~50 komponens)
│   └── ImageWithFallback/
├── constants/        # Alkalmazás-szintű konstansok
├── context/          # React Context providerek (EraContext, TokenContext)
├── features/         # Feature modulok (domain-szintű oldalak)
│   ├── auth/         #   Bejelentkezés, regisztráció, jelszó-visszaállítás
│   ├── booking/      #   Ülőhely-foglalás, fizetés, jegy
│   ├── era-page/     #   Korstílus-specifikus filmkatalógus
│   ├── landing-page/ #   Főoldal az éra-választóval
│   ├── movie/        #   Film részletek, értékelések, stáb
│   ├── news/         #   Hírek és cikkek
│   ├── profile/      #   Felhasználói profil és beállítások
│   ├── screening/    #   Vetítések böngészése
│   └── search/       #   Globális filmkeresés
├── hooks/            # Egyedi React hook-ok (30+ fájl)
├── routes/           # React Router konfiguráció
└── types/            # TypeScript interfészek és típusdefiníciók
```

### Konfigurációs fájlok

A projekt gyökerében az alábbi konfigurációs fájlok találhatók:

- **`vite.config.ts`** – Vite build konfiguráció a React és Tailwind CSS pluginekkel.
- **`tsconfig.json`** / **`tsconfig.app.json`** – TypeScript strict mód, ES2022 target, `react-jsx` JSX transzformáció.
- **`eslint.config.js`** – ESLint 9 flat config, TypeScript ESLint plugin, React Hooks és React Refresh szabályok.
- **`package.json`** – 39 függőség, 14 fejlesztői függőség. Scriptek: `dev`, `build`, `lint`, `preview`.

### Build pipeline

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

A build folyamat először TypeScript típusellenőrzést végez (`tsc -b`), majd a Vite bundleli az alkalmazást.

### Belépési pont

A `main.tsx` fájl a gyökér komponens, amely a provider hierarchiát definiálja:

```
BrowserRouter → TokenProvider → EraProvider → AppRoutes
```

Ez a sorrend biztosítja, hogy az autentikáció és az éra-kontextus minden útvonalhoz és komponenshez elérhető legyen.

---

## 6.2 Komponensalapú felépítés

### Komponens architektúra

Az alkalmazás React funkcionális komponensekre épül, hook-okkal kezelt állapottal. A komponensek három fő rétegbe szerveződnek:

1. **Feature komponensek** (`src/features/`) – Teljes oldalak és üzleti logikával rendelkező nézetek.
2. **Layout komponensek** (`src/components/layout/`) – Az oldal váza: `Navbar` és `Footer`.
3. **UI komponensek** (`src/components/ui/`) – Alacsony szintű, újrafelhasználható elemek (shadcn/ui + Radix UI).

### Feature modulok részletezése

| Feature | Fő komponensek | Funkció |
|---|---|---|
| **auth** | `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage` | Autentikációs folyamatok |
| **booking** | `SeatsPage`, `PaymentPage`, `PaymentForm`, `SeatMap`, `OrderSummary`, `BookingStepper`, `CheckoutGuard`, `TicketPage` | Teljes foglalási munkafolyamat (ülés→fizetés→jegy) |
| **era-page** | `EraPage` | Korstílus-specifikus filmkatalógus |
| **landing-page** | `LandingPage`, `EraSelector`, `FeaturedSection` | Főoldal korszak-választóval |
| **movie** | `MovieInfoPage`, `CastItem`, `ReviewItem`, `AddReviewCard`, `StarRating`, `SimilarCard`, `GalleryThumb`, `MetaChip` | Film részletek, értékelések, hasonló filmek |
| **news** | `NewsPage`, `ArticleDetailPage`, `ArticleGrid`, `NewsHero`, `NewsSidebar`, `ArticleCard` | Hír- és cikkmodul |
| **profile** | `ProfilePage`, `ProfileHeader`, `SettingsContent`, `WatchlistContent`, `TicketsContent`, `TicketCard` | Profil, beállítások, watchlist, jegyek |
| **screening** | `ScreeningsPage`, `WeekStrip`, `TimePill`, `FilterTabs`, `FilmRow`, `FormatTag` | Vetítések napi nézete |
| **search** | `SearchResultsPage`, `SearchBar` | Filmkeresés |

### UI komponenskönyvtár (shadcn/ui)

Az `src/components/ui/` könyvtár ~50 komponenst tartalmaz, amelyek a **shadcn/ui** könyvtár mintáját követik. Ezek a **Radix UI** headless primitívekre épülnek, és a **class-variance-authority (CVA)** könyvtárral kezelik a variánsokat.

Példa a `Button` komponens variáns-rendszerére:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background text-foreground hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
```

### Kompozíciós minták

A feature komponensek jellemző felépítése:

```tsx
export function MovieInfoPage() {
  // 1. Hook-ok az adatlekéréshez
  const { movie, loading, error } = useMovie(movieId);
  const { similar } = useSimilarMovies(movieId);

  // 2. Lokális UI állapot
  const [reviews, setReviews] = useState<any[]>([]);

  // 3. Optimista frissítés
  const handleReviewSubmit = async (rating, text) => {
    setReviews(prev => [newReview, ...prev]);  // Azonnali UI frissítés
    try { await submitComment(movieId, { text, rating }); }
    catch { setReviews(prev => prev.filter(r => r !== newReview)); }  // Visszagörgetés
  };

  // 4. Layout kompozíció
  return (
    <>
      <Navbar />
      {loading ? <MovieInfoPageSkeleton /> : <MovieContent movie={movie} />}
      <Footer />
    </>
  );
}
```

A komponensek megvalósítják a **skeleton loading** mintát, amelynél betöltés közben a tényleges tartalom helyett animált placeholder elemek jelennek meg.

---

## 6.3 Állapotkezelés

### Állapotkezelési stratégia

Az alkalmazás **nem használ külső állapotkezelő könyvtárat** (sem Redux-ot, sem Zustand-ot). Ehelyett három rétegű állapotkezelést alkalmaz:

1. **React Context API** – Globális, alkalmazás-szintű állapot (autentikáció, éra-választás).
2. **Egyedi hook-ok** – Szerver-oldali adatok lekérése és cache-elése.
3. **Lokális komponens állapot** – UI-specifikus állapot (`useState`).

### EraContext – Korszak-választás kezelése

Az `EraContext` kezeli a kiválasztott mozi-korszakot, amely az alkalmazás vizuális témáját meghatározza:

```tsx
export type Era = "90s" | "2000s" | "modern" | null;

interface EraContextType {
  era: Era;
  setEra: (era: Era) => void;
  lastClearedAt: number | null;
  previousEra: Era;
  restorePreviousEra: () => void;
}
```

**Főbb jellemzők:**
- **localStorage perzisztencia** – A kiválasztott éra a `"epoch:era"` kulcs alatt mentődik, így az oldal újratöltése után is megmarad.
- **Előző éra nyilvántartása** – A `previousEra` és `restorePreviousEra()` lehetővé teszi az éra visszaállítását (pl. bejelentkezés utáni navigáció).
- **Szinkron inicializálás** – A `localStorage`-ból szinkron módon olvasódik az éra, így elkerülhető a UI villanás.

### TokenContext – Autentikáció és felhasználói állapot

A `TokenContext` kezeli a felhasználó bejelentkezési állapotát:

```tsx
interface TokenContextValue {
  token: string | null;
  setToken: (t: string | null) => void;
  user: any | null;
  setUser: (u: any | null) => void;
  logout: () => Promise<void>;
}
```

**Főbb jellemzők:**
- **Cookie-alapú perzisztencia** – A felhasználói profil a `"epoch_user_profile"` sütiből töltődik (7 napos lejárat, `js-cookie` könyvtár).
- **Automatikus token-validáció** – Az alkalmazás betöltésekor `fetchMe()` hívás ellenőrzi a session érvényességét.
- **Kétszintű kijelentkezés** – A `logout()` először a szerveren invalidálja a tokent (`POST /api/logout`), majd a kliensen törli a sütiket és az állapotot.

### Hook-alapú adatlekérés

Az egyedi hook-ok egységes mintát követnek a szerver-oldali adatok kezelésére:

```tsx
export function useHook(id: string | null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetchData(id);
        if (!mounted) return;
        setData(res);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  return { data, loading, error };
}
```

**Közös jellemzők:**
- `mounted` flag a React strict mode és unmount utáni állapotfrissítés elkerüléséhez.
- `AbortSignal` támogatás a fetch kérések megszakításához komponens unmountoláskor.
- Loading/error/data hármas visszatérés konzisztens kezelése.

### SessionStorage – Átmeneti foglalási állapot

A foglalási folyamat során a `sessionStorage` szolgál az átmeneti adatok tárolására (`"epoch:pendingBooking"` kulcs). A `usePendingBookingCleanup` hook automatikusan törli ezeket, ha a felhasználó elhagyja a foglalási útvonalat.

---

## 6.4 Routing

### React Router v7 konfiguráció

Az alkalmazás a `react-router-dom` v7.10.1 könyvtárat használja, `BrowserRouter` módban. Az összes útvonal az `AppRoutes` komponensben van definiálva:

| Útvonal | Komponens | Leírás |
|---|---|---|
| `/` | `LandingPage` | Főoldal éra-választóval |
| `/:eraId` | `EraPage` | Korstílus-specifikus filmkatalógus |
| `/screenings` | `ScreeningsPage` | Vetítések böngészése |
| `/movies/:movieId` | `MovieInfoPage` | Film részletek oldal |
| `/article/:articleId` | `ArticleDetailPage` | Hír/cikk részletek |
| `/search` | `SearchResultsPage` | Keresési eredmények |
| `/profile` | `ProfilePage` | Felhasználói profil |
| `/booking/:screeningId` | `SeatsPage` | Ülőhely-választás |
| `/payment/:bookingId` | `PaymentPage` | Fizetési oldal |
| `/checkout/:bookingId` | `CheckoutGuard` | Fizetés utáni ellenőrzés |
| `/login` | `LoginPage` | Bejelentkezés |
| `/register` | `RegisterPage` | Regisztráció |
| `/forgot-password` | `ForgotPasswordPage` | Jelszó-visszaállítás kérése |
| `/password-reset/:token` | `ResetPasswordPage` | Új jelszó megadása |

### Navigációs minták

A komponensek közötti navigáció a `useNavigate()` hook-on és az `onNavigate` callback prop-okon keresztül történik:

```tsx
const navigate = useNavigate();

// Programozási navigáció sikeres foglalás után
navigate(`/payment/${bookingId}`, { state: { booking: lockedBooking } });
```

A `useLocation()` hook és a `state` property lehetővé teszi adatok átadását navigáció közben (pl. foglalási adatok a SeatsPage-ről a PaymentPage-re).

### Foglalási folyamat útvonalvédelem

A `CheckoutGuard` komponens biztosítja, hogy a fizetés utáni jegyoldal (`TicketPage`) csak érvényes foglalás esetén legyen elérhető:

```tsx
export default function CheckoutGuard() {
  const { bookingId } = useParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Ellenőrzi, hogy a sessionStorage-ban lévő foglalás ID megegyezik-e
    const stored = JSON.parse(sessionStorage.getItem("epoch:pendingBooking"));
    setAllowed(String(stored?.id) === String(bookingId));
  }, [bookingId]);

  useEffect(() => {
    if (allowed === false) navigate("/", { replace: true });
  }, [allowed]);

  if (!allowed) return null;
  return <TicketPage />;
}
```

### Útvonal-alapú állapottisztítás

A `usePendingBookingCleanup` hook figyeli a navigációs változásokat, és automatikusan törli a foglalási session-adatokat, amikor a felhasználó elhagyja a `/booking`, `/payment` vagy `/checkout` útvonalakat:

```tsx
useEffect(() => {
  const isBookingRoute = (path: string) =>
    /^\/(booking|payment|checkout)(\/|$)/.test(path);

  if (isBookingRoute(prevPath) && !isBookingRoute(currentPath)) {
    sessionStorage.removeItem("epoch:pendingBooking");
  }
}, [location.pathname]);
```

---

## 6.5 API integrációk

### Központi HTTP kliens

Az API kommunikáció egy egyedi `apiFetch` wrapper függvényen keresztül történik, amely a natív `fetch` API-ra épül:

```tsx
async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T>
```

**Konfiguráció:**
- **Base URL:** `import.meta.env.VITE_API_BASE || "http://localhost:8000"`
- **Timeout:** 10 másodperc alapértelmezett timeout `AbortSignal`-lal.
- **Hitelesítő adatok (Credentials):** `credentials: "include"` – HttpOnly cookie-k automatikus küldése.
- **Fejlécek:** `Accept: application/json`, `X-Requested-With: XMLHttpRequest`, `Content-Type: application/json` (FormData esetén a böngésző állítja be).
- **Hibakezlés:** HTTP hibák normalizálása, a válasz `status` és `body` property-k csatolásával az Error objektumhoz.

### API modulok

A `src/api/` könyvtár domain-specifikus modulokba szervezi az API hívásokat:

| Modul | Végpontok | Leírás |
|---|---|---|
| `login.ts` | `POST /api/login` | Bejelentkezés, `{ user, token }` válasz |
| `register.ts` | `POST /api/register` | Regisztráció |
| `logout.ts` | `POST /api/logout` | Kijelentkezés (szerver-oldali token invalidáció) |
| `user.ts` | `GET /api/user/me`, `PATCH /api/user/me` | Profil lekérés/frissítés, FormData avatár feltöltés |
| `password.ts` | `POST /api/forgot-password`, `POST /api/reset-password` | Jelszó-visszaállítási folyamat |
| `eras.ts` | `GET /api/eras` | Korszakok listázása |
| `movies.ts` | `GET /api/movies`, `GET /api/movies/:id`, `GET /api/movies/:id/similar` | Filmek lekérése, keresés, hasonló filmek |
| `news.ts` | `GET /api/news`, `GET /api/news/:id` | Hírek és cikkek |
| `screenings.ts` | `GET /api/screenings?start_date=` | Vetítések dátum szerinti lekérdezés |
| `seats.ts` | `GET /api/screenings/:id/seats` | Ülőhely-elérhetőség |
| `booking.ts` | `POST /api/bookings/lock`, `POST /api/bookings/:id/checkout` | Foglalás létrehozás és véglegesítés |
| `comment.ts` | `POST /api/movies/:id/comments`, `DELETE /api/movies/:id/comments` | Értékelések kezelése |
| `watchlist.ts` | `DELETE /api/profileWatchlists/:id` | Watchlist elem törlése |

### Válasz-normalizálás

Az API modulok rugalmasan kezelik a backend válasz struktúráját, több lehetséges formátumot is elfogadva:

```tsx
export async function fetchMoviesByEra(eraId: number): Promise<Movie[]> {
  const data = await apiFetch<any>(`/api/movies?era_id=${eraId}`);

  if (Array.isArray(data)) return data;
  if (data?.movies && Array.isArray(data.movies)) return data.movies;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.items && Array.isArray(data.items)) return data.items;

  return [];
}
```

Ez a minta biztosítja a frontend stabilitását akkor is, ha a backend válaszstruktúrája változik.

### Hook és API réteg kapcsolata

Minden API modul egy vagy több egyedi hook-on keresztül érhető el a komponensekből. A hook-ok felelnek a loading állapot, hibakezelés és adat-cache kezeléséért:

```
Komponens → useMovie() hook → fetchMovie() API modul → apiFetch() HTTP kliens → Backend
```

---

## 6.6 Űrlapkezelés és validáció

### Használt könyvtárak

Az alkalmazás két megközelítést kombinál az űrlapkezeléshez:

1. **React Hook Form** (v7.55.0) – A shadcn/ui `Form` komponensen keresztül, deklaratív mezőkezeléssel.
2. **Manuális állapotkezelés** – Az `useState` hook-kal kezelt mezők, egyedi validációs logikával.

### shadcn/ui Form integráció

Az `src/components/ui/form.tsx` a React Hook Form `FormProvider`-re és `Controller`-re épül:

```tsx
<Form {...methods}>
  <FormField
    control={methods.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} type="email" />
        </FormControl>
        <FormMessage />  {/* Automatikus hibaüzenet */}
      </FormItem>
    )}
  />
</Form>
```

### Manuális validáció – Regisztrációs oldal

A `RegisterPage` komponens manuális validációt alkalmaz a submit handlerben:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const newErrors: Record<string, string> = {};

  if (!username) newErrors.username = "Username is required";
  else if (username.length < 3) newErrors.username = "Username must be at least 3 characters";

  if (!email) newErrors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";

  if (!password) newErrors.password = "Password is required";
  else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

  if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  await register({ username, email, password, confirmPassword });
};
```

### Fizetési űrlap validáció

A `useVerifyPaymentForm` hook a legrészletesebb validációs logikát valósítja meg. Ez a hook kezeli a bankkártya-adatok bevitelét és ellenőrzését:

**Validált mezők:**
- **Név** – Minimum 2 karakter.
- **Kártyaszám** – Pontosan 16 számjegy, automatikus 4-es csoportosítás (`1234 5678 9012 3456`).
- **Lejárat** – `MM/YY` formátum, hónap 1–12, lejárat-ellenőrzés az aktuális dátumhoz képest.
- **CVC** – 3–4 számjegy.
- **Ország** – Kötelező, minimum 2 karakter.
- **Irányítószám** – 3–10 alfanumerikus karakter.
- **Email** – Opcionális (vendég felhasználóknak), szabványos email regex.

**Intelligens formázás:**

```tsx
const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
};
```

A fizetési űrlap a **touched** mintát alkalmazza: a validációs hibaüzenetek csak azután jelennek meg, hogy a felhasználó elhagyta az adott mezőt (`onBlur`), vagy megnyomta a fizetés gombot.

### Jelszó-visszaállítás validáció

A `ResetPasswordPage` valós idejű jelszó-követelmény ellenőrzést biztosít:

- Minimum 8 karakter hosszúság
- Legalább egy nagybetű
- Legalább egy kisbetű
- Legalább egy szimbólum
- Legalább egy szám

A követelmények vizuálisan jelezve vannak — zölddel a teljesítettek, szürkével a még nem teljesítettek, `motion` animációval.

### Profil beállítások űrlap

A `SettingsContent` egy „piszkos állapot" (dirty state) mintát követ: csak a módosított mezők kerülnek elküldésre a szervernek. A `useSettings` hook nyilvántartja, mely mezők változtak:

```tsx
const setField = useCallback((key, value) => {
  setSettings(s => ({ ...s, [key]: value }));
  setDirty(d => { const next = new Set(d); next.add(key); return next; });
}, []);
```

Az avatár-feltöltés `FormData`-t használ, a `useSettings` hook automatikusan `FormData`-ba csomagolja a kérést, ha `File` típusú mező van jelen.

---

## 6.7 Jogosultságkezelés a kliensoldalon

### Autentikációs architektúra

Az Epoch Cinema alkalmazás **cookie-alapú session autentikációt** használ. A backend HttpOnly cookie-kat kezel, amelyeket a böngésző automatikusan küld minden kéréshez a `credentials: "include"` beállításnak köszönhetően.

### TokenContext – Központi autentikációs állapot

A `TokenProvider` az alkalmazás gyökerében helyezkedik el és az alábbi feladatokat látja el:

1. **Automatikus session-validáció** – Alkalmazás betöltésekor `fetchMe()` hívással ellenőrzi a cookie érvényességét.
2. **Felhasználói profil tárolása** – A felhasználó adatait a `user` állapotban és a `epoch_user_profile` cookie-ban tárolja.
3. **Kijelentkezés** – A `logout()` metódus szerver-oldali invalidálást és kliens-oldali állapottörlést egyaránt végez.

### Bejelentkezési folyamat

```
1. Felhasználó → LoginPage: email + jelszó megadása
2. LoginPage → useLogin() hook: validáció, API hívás
3. useLogin() → POST /api/login: szerver autentikáció
4. Szerver → HttpOnly cookie beállítása + user/token válasz
5. useLogin() → TokenContext: setUser(me), setToken("session")
6. useLogin() → EraContext: setEra(null) – éra-választás törlése
7. LoginPage → navigate("/"): átirányítás a főoldalra
```

### Regisztrációs folyamat

A `RegisterPage` a `useRegister()` hook-on keresztül kommunikál a `POST /api/register` végponttal. Sikeres regisztráció után a komponens success üzenetet jelenít meg, de **nem jelentkezik be automatikusan** – a felhasználónak külön be kell jelentkeznie.

### Jelszó-visszaállítás

Kétlépéses folyamat:
1. **`ForgotPasswordPage`** → `useSendResetEmail()` → `POST /api/forgot-password` – Email küldése visszaállító linkkel.
2. **`ResetPasswordPage`** → `useResetPassword()` → `POST /api/reset-password` – Új jelszó beállítása a tokennel. A token az URL-ből (`/password-reset/:token`), az email a query paraméterből (`?email=`) olvasódik.

### Feltételes UI megjelenítés

A Navbar komponens a `useToken()` hook-on keresztül dönti el, milyen tartalmat jelenít meg:

```tsx
const { user, logout } = useToken();

// Bejelentkezett felhasználó → Avatár + Dropdown menü + Kijelentkezés
{user && (
  <Avatar>
    <AvatarImage src={avatarSrc} />
  </Avatar>
)}

// Nem bejelentkezett → Bejelentkezés / Regisztráció gombok
{!user && (
  <>
    <Button onClick={() => navigate("/login")}>Sign In</Button>
    <Button onClick={() => navigate("/register")}>Join Now</Button>
  </>
)}
```

### Útvonalvédelem

Az alkalmazás nem használ dedikált `ProtectedRoute` wrapper komponenst. Ehelyett az egyes feature komponensek a `TokenContext`-ből származó `user` állapot alapján jelenítik meg a tartalmat, vagy irányítják át a felhasználót. A `CheckoutGuard` a `sessionStorage`-ban tárolt foglalási adatok alapján engedélyezi vagy tiltja a hozzáférést a jegyoldalhoz.

---

## 6.8 Felhasználói felület kialakítása

### Vizuális koncepció – Éra-alapú tematizálás

Az Epoch Cinema alkalmazás központi vizuális jellemzője a **korszak-alapú (era-based) tematizálás**. Három korszak érhető el, mindegyik egyedi színvilággal:

| Korszak | Jellemző szín | CSS változó (`--theme-accent`) | Hangulat |
|---|---|---|---|
| **90s** | Borostyán (Amber) | `#f59e0b` | Meleg, nosztalgikus |
| **2000s** | Kék (Blue) | `#60a5fa` | Hűvös, digitális |
| **Modern** | Palaszürke (Slate) | `#cbd5e1` | Letisztult, minimalista |

### CSS custom property alapú témaváltás

A témák CSS változókon (`data-theme` attribútum) keresztül valósulnak meg:

```css
[data-theme="90s"] {
  --theme-accent: #f59e0b;
  --theme-border: rgba(217, 119, 6, 0.2);
  --theme-button-bg: #d97706;
  --theme-button-hover: #f59e0b;
  --theme-glow: rgba(245, 158, 11, 0.5);
}

[data-theme="2000s"] {
  --theme-accent: #60a5fa;
  --theme-border: rgba(59, 130, 246, 0.2);
  --theme-button-bg: #3b82f6;
  --theme-button-hover: #60a5fa;
  --theme-glow: rgba(96, 165, 250, 0.5);
}
```

Egyes komponensek (pl. `Navbar`, `Footer`) a Tailwind utility class-ok dinamikus összeállításával valósítják meg a témaváltást:

```tsx
const colors = (() => {
  switch (appliedTheme) {
    case "90s": return { accent: "text-amber-500", hover: "hover:text-amber-400", glow: "hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" };
    case "2000s": return { accent: "text-blue-400", ... };
    case "modern": return { accent: "text-slate-300", ... };
  }
})();
```

### Tailwind CSS 4 integráció

Az alkalmazás a **Tailwind CSS 4.1.18**-at használja, az új Vite plugin integrációval (`@tailwindcss/vite`). Az `index.css`-ben az `@import "tailwindcss"` direktíva tölt be mindent.

A stílusok közvetlenül utility class-okkal készülnek. Összetettebb komponenseknél a `cn()` segédfüggvény (amely a `clsx` + `tailwind-merge` kombináció) biztosítja a Tailwind class-ok helyes összefésülését:

```tsx
import { cn } from "@/lib/utils";
<div className={cn("bg-card text-card-foreground rounded-xl border", className)} />
```

### Animációk (Motion)

Az alkalmazás a **motion** (v12.23.26) könyvtárat használja animációkhoz, amely a Framer Motion utódja:

```tsx
import { motion, AnimatePresence } from "motion/react";

// Oldal belépési animáció
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
>

// Gomb interakció
<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>

// Lista elemek egymás utáni animációja
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.1 }}
  />
))}
```

### Reszponzív tervezés

Az alkalmazás mobile-first megközelítést alkalmaz Tailwind breakpoint-okkal:
- **Mobil** – Egymás alatti elrendezés, sticky CTA gomb a fizetési oldalon.
- **Desktop** (`lg:`) – Többoszlopos grid layout (pl. `lg:grid-cols-[minmax(0,1fr)_380px]` a PaymentPage-en).

### Ikonok és vizuális elemek

- **Lucide React** (`lucide-react`) – SVG ikon könyvtár (pl. `CreditCard`, `Lock`, `Mail`, `User`, `ChevronLeft`).
- **Toast értesítések** – `sonner` (v2.0.3) könyvtár.
- **Carousel** – `embla-carousel-react` (v8.6.0) a film-galériákhoz.
- **Skeleton loading** – Betöltés közben animált placeholder elemek.

### Sötét téma

Az alkalmazás alapértelmezetten **sötét témát** használ, fekete-szürke háttérrel és `backdrop-blur` effektusokkal:

```tsx
<div className="min-h-screen bg-linear-to-b from-black via-slate-950 to-black">
  <div className="bg-black/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl">
```

A `next-themes` könyvtár is elérhető a projektben, de az esztétikai koncepció a sötét témára épül.

---

## 6.9 Frontend tesztelés

### Jelenlegi tesztelési állapot

A projekt jelenlegi állapotában **nincs konfigurált automatizált tesztelési keretrendszer**. A `package.json` nem tartalmaz test scriptet, és nem találhatók `.test.ts`, `.spec.ts` vagy `.test.tsx` fájlok a forráskódban.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Statikus kódelemzés

A kódminőség biztosítása jelenleg két szinten történik:

1. **TypeScript strict kompilálás** – A `tsconfig.app.json` strict módban van konfigurálva, amely kiszűri a típushibákat, a nem használt változókat és paramétereket build időben.

2. **ESLint** – Az ESLint 9 a TypeScript ESLint pluginnel együtt biztosítja a kódstílus és a React best practice-ek betartását (React Hooks szabályok, React Refresh kompatibilitás).

### Javasolt tesztelési stratégia

A projekt architektúrája jól felkészített az automatizált tesztelésre. A hook-ok és API modulok tisztán függvényes felépítése, valamint a komponensek prop-alapú tervezése megkönnyíti a unit és integrációs tesztek bevezetését. Egy javasolt tesztelési terv:

**1. Egységtesztek (Unit Tests) – Vitest**

A Vite ökoszisztéma natív tesztelési keretrendszere a **Vitest**, amely a legegyszerűbb integrációt biztosítja.

Javasolt tesztelési területek:
- **Egyedi hook-ok**: `useVerifyPaymentForm` validációs logikája, `useLogin` és `useRegister` állapotkezelése.
- **API modulok**: `apiFetch` hibakezélés, válasz-normalizálás (pl. `fetchMoviesByEra` különböző válasz-formátumokkal).
- **Utility függvények**: Kártyaszám-formázás, lejárat-ellenőrzés, dátumkezelés.

Példa:
```tsx
// useVerifyPaymentForm.test.ts
import { renderHook, act } from "@testing-library/react";
import { useVerifyPaymentForm } from "./useVerifyPaymentForm";

test("formatCardNumber groups digits by 4", () => {
  const { result } = renderHook(() => useVerifyPaymentForm({}));
  act(() => result.current.handleChange("cardNumber", "1234567890123456"));
  expect(result.current.formData.cardNumber).toBe("1234 5678 9012 3456");
});

test("rejects expired card", () => {
  const { result } = renderHook(() => useVerifyPaymentForm({}));
  act(() => result.current.handleChange("expiry", "01/20"));
  act(() => result.current.handleBlur("expiry"));
  expect(result.current.errors.expiry).toBe("Card has expired");
});
```

**2. Komponens tesztek – React Testing Library**

A `@testing-library/react` lehetővé teszi a felhasználói interakciók szimulálását:

```tsx
// LoginPage.test.tsx
test("shows validation errors for empty fields", async () => {
  render(<LoginPage onNavigate={() => {}} />);
  fireEvent.click(screen.getByText("Log In"));
  expect(screen.getByText("Email is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
});
```

**3. End-to-End tesztek – Playwright / Cypress**

A teljes felhasználói folyamatok (pl. foglalás: ülőhely-választás → fizetés → jegy) E2E tesztekkel lennének a leghatékonyabban validálhatók.

**Javasolt beüzemelés:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

A jelenlegi állapotban a kódminőséget a TypeScript típusrendszer és az ESLint biztosítja, de a projekt mérete és komplexitása indokolja az automatizált tesztek bevezetését.
