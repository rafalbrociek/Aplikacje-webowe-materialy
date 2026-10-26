import { NavLink } from "react-router";

export function MainNavigation() {
  return (
    <nav className="navigation">
      {/*
        NavLink to komponent biblioteki React Router.
        Służy do tworzenia linków nawigacyjnych wewnątrz aplikacji React.
        end to właściwość, określa sposób dopasowania aktualnego adresu URL do 
        ścieżki linku. Dla zwykłej trasy, np. /persons, bez end link może być 
        aktywny również dla tras zagnieżdżonych, np. /persons/5
      */}
      <NavLink
        to="/"
        end
        /* className dynamicznie ustala klasę CSS na podstawie stanu linku */
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Strona główna
      </NavLink>

      <NavLink
        to="/persons"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Osoby
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        O aplikacji
      </NavLink>
    </nav>
  );
}
