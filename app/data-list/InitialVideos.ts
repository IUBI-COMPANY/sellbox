export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  /**
   * CSS aspect-ratio value for the video (e.g. "9/16", "16/9", "1/1").
   * Used on desktop to size the card correctly for any orientation.
   * Defaults to "9/16" (portrait) if omitted.
   */
  aspect_ratio?: string;
  creator: {
    username: string;
    display_name: string;
    avatar_url?: string;
    is_followed: boolean;
  };
  likes: number;
  comments_count: number;
  shareds_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  product: {
    id: string;
    title: string;
    price: string;
    whatsapp_link: string;
  };
}

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "1",
    title: "AnyCast M12 PLUS",
    description:
      "Dispositivo para duplicar pantalla de celular, laptops y tablets de manera inalámbrica. ¡Ideal para streaming! VER MÁS",
    video_url: "a9Duarr84ksrDCsNYbnTUKZmbymUZyDZ9omkyDAQzqA",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 99000,
    comments_count: 1390,
    shareds_count: 390,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
  {
    id: "2",
    title: "Así funciona el adatador ELPAP07 de Epson",
    description:
      "Review de todos los adaptadores wireless originales para los proyectores epson",
    video_url: "PdbbzxX4BSvh1RuWJxdcEjGmUYWuHLSaajL1oIFYBiw",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 12000,
    comments_count: 340,
    shareds_count: 240,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
  {
    id: "3",
    title: "Probando el adaptador ELPAP10 de Epson",
    description:
      "¿No tienes TV? Conecta tu celular a un monitor clásico de PC usando este adaptador. ¡Trabaja y juega en grande!",
    video_url: "K3XChUXqqFnqZUvnENNSgGeLJJ003UThT83XLwsu2j01c",
    creator: {
      username: "lyccomputetech",
      display_name: "L&C Computer Tech",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      is_followed: false,
    },
    likes: 4500,
    comments_count: 98,
    shareds_count: 78,
    is_liked: false,
    is_bookmarked: false,
    product: {
      id: "anycast-m12",
      title: "AnyCast M12 PLUS",
      price: "89.90",
      whatsapp_link:
        "https://wa.me/51999999999?text=Hola,%20quiero%20comprar%20el%20AnyCast%20M12%20PLUS",
    },
  },
];
