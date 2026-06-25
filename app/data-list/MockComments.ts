export interface Comment {
  id: string;
  username: string;
  avatar_url?: string;
  content: string;
  created_at: string;
  likes: number;
}

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      username: "carlos_tech",
      content: "¿Viene con manual en español? Funciona muy bien.",
      created_at: "2h",
      likes: 24,
    },
    {
      id: "c2",
      username: "sofia.g",
      content: "¿Es compatible con iPhone 15? Necesito uno así.",
      created_at: "4h",
      likes: 12,
    },
    {
      id: "c3",
      username: "pedro_m",
      content: "¡Excelente producto! Me llegó súper rápido por WhatsApp.",
      created_at: "1d",
      likes: 5,
    },
  ],
  "2": [
    {
      id: "c4",
      username: "lucas_d",
      content: "Súper bien explicado, gracias por el video.",
      created_at: "5h",
      likes: 8,
    },
    {
      id: "c5",
      username: "maria_luz",
      content: "¿Venden al por mayor para tiendas?",
      created_at: "1d",
      likes: 18,
    },
  ],
  "3": [
    {
      id: "c6",
      username: "juan_perez",
      content: "¿Qué resolución soporta en monitor?",
      created_at: "1h",
      likes: 2,
    },
  ],
};
