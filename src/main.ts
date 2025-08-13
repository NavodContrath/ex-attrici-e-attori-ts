import type { Actress } from "./type";

function isActress(dati: unknown): dati is Actress {
  if (
    dati &&
    typeof dati === "object" &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    "death_year" in dati &&
    typeof dati.death_year === "number" &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    Array.isArray(dati.most_famous_movies) &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(movie => typeof movie === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string"
  ) {
    return true
  }
  return false

}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`)
    if (!response.ok) {
      throw new Error(`HTP Error ${response.status}:${response.statusText}`)
    }
    const dati: unknown = await response.json()

    if (!isActress(dati)) {
      throw new Error('Formato dei dati non valido')
    }
    console.log(dati)
    return dati
  } catch (errore) {
    if (errore instanceof Error) {
      console.log(`Errore durante il recupero dati, ${errore.message}`)
    }
    return null

  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`)
    if (!response.ok) {
      throw new Error(`HTP Error ${response.status}:${response.statusText}`)
    }
    const dati: unknown = await response.json()
    if (Array.isArray(dati)) {
      return dati.filter(isActress)
    }
    return []
  } catch (errore) {
    if (errore instanceof Error) {
      console.log(`Errore durante il recupero dati, ${errore.message}`)
    }
    return []
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  const promises = ids.map(id => getActress(id))
  const dati = await Promise.all(promises)
  return dati
}

async function createActress(nuovaAttrice: Omit<Actress, "id">): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuovaAttrice)
    })
    if (!response.ok) {
      throw new Error(`HTP Error ${response.status}:${response.statusText}`)
    }
    const dati: unknown = await response.json()

    if (isActress(dati)) {
      return dati
    }
    throw new Error('Formato dei dati non valido')

  } catch (errore) {
    if (errore instanceof Error) {
      console.log(`Errore durante il recupero dati, ${errore.message}`)
    }
    return null
  }
}

async function updateActress(id: number, attriceAggiornata: Partial<Omit<Actress, "id" | "name">>): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attriceAggiornata)
    })
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    const dati: unknown = await response.json()

    if (!isActress(dati)) {
      throw new Error('Formato dei dati non valido')
    }
    console.log(dati)
    return dati
  } catch (errore) {
    if (errore instanceof Error) {
      console.log(`Errore durante il recupero dati, ${errore.message}`)
    }
    return null

  }

}

