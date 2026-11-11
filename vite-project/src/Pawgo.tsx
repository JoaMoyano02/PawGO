import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Dog, MapPin, ShieldCheck, Clock, CreditCard, Star, 
  User, CheckCircle, Navigation, Camera, 
  Calendar, Bell, Square, Sparkles, 
  ChevronRight, ArrowLeft, MessageSquare, Send,
  LogOut, Mail, LockKeyhole
} from 'lucide-react';

type UserRole = 'dueño' | 'paseador';

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  energy: string;
  reactiveness: string;
  size: string;
  notes: string;
  photo: string;
};

// Mock initial data
const INITIAL_PETS: Pet[] = [
  { id: 1, name: "Rocco", breed: "Golden Retriever", age: 3, energy: "Alta", reactiveness: "Baja", size: "Grande", notes: "Le encanta correr en el Parque Sarmiento y jugar con pelotas.", photo: "🐕" },
  { id: 2, name: "Luna", breed: "French Bulldog", age: 2, energy: "Media", reactiveness: "Media", size: "Pequeño", notes: "Sensible al calor, requiere descansos con agua cerca del Buen Pastor.", photo: "🐶" }
];

type WalkerProfile = {
  id: number;
  name: string;
  rating: number;
  walksDone: number;
  distance: string;
  verified: boolean;
  avatar: string;
  bio: string;
  badge: string;
  neighborhoods: string[];
  mapPosition: { left: string; top: string };
};

const paseadorS: WalkerProfile[] = [
  { id: 101, name: "Mateo Rossi", rating: 4.9, walksDone: 154, distance: "Nueva Córdoba (A 200m)", verified: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80", bio: "Estudiante de Veterinaria en la UNC. Amante del Parque Sarmiento.", badge: "Primeros Auxilios", neighborhoods: ["Nueva Córdoba", "Centro", "General Paz", "Alberdi"], mapPosition: { left: "58%", top: "60%" } },
  { id: 102, name: "Camila Peralta", rating: 4.8, walksDone: 112, distance: "Güemes (A 450m)", verified: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", bio: "Entrenadora canina en Córdoba Capital. Rutas por Cañada y Güemes.", badge: "Entrenador Certificado", neighborhoods: ["Güemes", "Nueva Córdoba", "Observatorio", "Centro"], mapPosition: { left: "43%", top: "49%" } },
  { id: 103, name: "Gonzalo Juárez", rating: 5.0, walksDone: 230, distance: "Cerro de las Rosas (A 1.2 km)", verified: true, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80", bio: "Paseos individuales y personalizados en Zona Norte y Alberdi.", badge: "Top Paseador", neighborhoods: ["Cerro de las Rosas", "Villa Belgrano", "Urca", "Argüello"], mapPosition: { left: "73%", top: "30%" } }
];

const CORDOBA_NEIGHBORHOODS = [
  "Alberdi",
  "Argüello",
  "Cerro de las Rosas",
  "Centro",
  "General Paz",
  "Güemes",
  "Nueva Córdoba",
  "Observatorio",
  "Urca",
  "Villa Belgrano"
];

type OwnerAccount = {
  id: string;
  role: 'dueño';
  email: string;
  password: string;
  name: string;
  pets: Pet[];
};

type WalkerAccount = {
  id: string;
  role: 'paseador';
  email: string;
  password: string;
  name: string;
  walkerId: number;
};

type DemoAccount = OwnerAccount | WalkerAccount;

const OWNER_ACCOUNTS: OwnerAccount[] = [
  {
    id: 'owner-valentina',
    role: 'dueño',
    email: 'valentina@pawgo.com',
    password: 'valentina123',
    name: 'Valentina Rodríguez',
    pets: INITIAL_PETS
  },
  {
    id: 'owner-sofia',
    role: 'dueño',
    email: 'sofia@pawgo.com',
    password: 'sofia123',
    name: 'Sofía Martínez',
    pets: [
      { id: 3, name: 'Mora', breed: 'Caniche', age: 4, energy: 'Media', reactiveness: 'Baja', size: 'Pequeño', notes: 'Le gusta pasear tranquila y parar a tomar agua.', photo: '🐩' },
      { id: 4, name: 'Pipo', breed: 'Beagle', age: 2, energy: 'Alta', reactiveness: 'Media', size: 'Mediano', notes: 'Es curioso y disfruta explorar plazas nuevas.', photo: '🐶' }
    ]
  },
  {
    id: 'owner-diego',
    role: 'dueño',
    email: 'diego@pawgo.com',
    password: 'diego123',
    name: 'Diego Fernández',
    pets: [
      { id: 5, name: 'Toto', breed: 'Labrador', age: 5, energy: 'Alta', reactiveness: 'Baja', size: 'Grande', notes: 'Muy sociable; disfruta los paseos largos.', photo: '🦮' },
      { id: 6, name: 'Nina', breed: 'Mestiza', age: 1, energy: 'Media', reactiveness: 'Media', size: 'Mediano', notes: 'Todavía está aprendiendo a caminar con correa.', photo: '🐕' }
    ]
  }
];

const WALKER_ACCOUNTS: WalkerAccount[] = [
  { id: 'walker-mateo', role: 'paseador', email: 'mateo@pawgo.com', password: 'mateo123', name: paseadorS[0].name, walkerId: paseadorS[0].id },
  { id: 'walker-camila', role: 'paseador', email: 'camila@pawgo.com', password: 'camila123', name: paseadorS[1].name, walkerId: paseadorS[1].id },
  { id: 'walker-gonzalo', role: 'paseador', email: 'gonzalo@pawgo.com', password: 'gonzalo123', name: paseadorS[2].name, walkerId: paseadorS[2].id }
];

const DEMO_ACCOUNTS: DemoAccount[] = [...OWNER_ACCOUNTS, ...WALKER_ACCOUNTS];

const paseador_REVIEWS = [
  { id: 1, rating: 5, date: "Hace 2 días", comment: "Fue muy puntual y mi perro volvió feliz. ¡Me mandó fotos durante todo el paseo!" },
  { id: 2, rating: 5, date: "Hace 1 semana", comment: "Súper atento y cariñoso con mi mascota. Sin dudas volvería a reservar." },
  { id: 3, rating: 4, date: "Hace 2 semanas", comment: "Muy buena experiencia, respetó los tiempos y las indicaciones. Recomendado." }
];

const PAST_WALKS = [
  { id: 501, date: "Ayer, 17:00 hs", paseadorName: "Mateo Rossi", petName: "Rocco", duration: "45 min", type: "Normal", price: 3500, rating: 5, status: "Completado" },
  { id: 502, date: "24 de Oct, 11:30 hs", paseadorName: "Camila Peralta", petName: "Luna", duration: "30 min", type: "Express", price: 2800, rating: 5, status: "Completado" }
];

//Declaracion clase Mensaje de chat
type ChatMessage = {
  id: number;
  sender: 'dueño' | 'paseador';
  text: string;
  time: string;
  isReport?: boolean;
};

//Declaracion clase Conversacion
type Conversation = {
  id: number;
  ownerId: string;
  paseadorId: number;
  paseadorName: string;
  paseadorAvatar: string;
  dueñoName: string;
  petName: string;
  petPhoto: string;
  time: string;
  dueñoUnread: number;
  paseadorUnread: number;
  messages: ChatMessage[];
};

type WalkPhoto = {
  time: string;
  text: string;
  img: string | null;
};

type ActiveWalk = {
  id: number;
  ownerId: string;
  conversationId: number;
  pet: Pet;
  paseador: WalkerProfile;
  type: string;
  durationMinutes: number;
  price: number;
  timeElapsed: number;
  routeProgress: number;
  status: 'requested' | 'in_progress' | 'finished';
  photos: WalkPhoto[];
};

type WalkerReview = {
  id: number;
  walkId: number;
  walkerId: number;
  rating: number;
  date: string;
  comment: string;
};

type ReviewDisplay = {
  id: number;
  walkId?: number;
  rating: number;
  date: string;
  comment: string;
};

//CONVERSACIONES INICIALES
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    ownerId: 'owner-valentina',
    paseadorId: 101,
    paseadorName: paseadorS[0].name,
    paseadorAvatar: paseadorS[0].avatar,
    dueñoName: 'Valentina Rodríguez',
    petName: 'Rocco',
    petPhoto: '🐕',
    time: '16:01',
    dueñoUnread: 0,
    paseadorUnread: 1,
    messages: [
      { id: 1, sender: 'paseador', text: '¡Hola! Ya estoy llegando a tu edificio en Nueva Córdoba para buscar a Rocco.', time: '16:00' },
      { id: 2, sender: 'dueño', text: '¡Buenísimo Mateo! Ya le puse pretal y pechera. Bajamos en 1 minuto.', time: '16:01' }
    ]
  },
  {
    id: 2,
    ownerId: 'owner-sofia',
    paseadorId: 102,
    paseadorName: paseadorS[1].name,
    paseadorAvatar: paseadorS[1].avatar,
    dueñoName: 'Sofía Martínez',
    petName: 'Mora',
    petPhoto: '🐶',
    time: '14:42',
    dueñoUnread: 0,
    paseadorUnread: 0,
    messages: [
      { id: 1, sender: 'paseador', text: 'Mora ya tomó agua y estamos volviendo. El paseo salió genial.', time: '14:38' },
      { id: 2, sender: 'dueño', text: '¡Qué bueno! Muchas gracias por cuidarla 😊', time: '14:42' }
    ]
  },
  {
    id: 3,
    ownerId: 'owner-diego',
    paseadorId: 103,
    paseadorName: paseadorS[2].name,
    paseadorAvatar: paseadorS[2].avatar,
    dueñoName: 'Diego Fernández',
    petName: 'Toto',
    petPhoto: '🦮',
    time: 'Ayer',
    dueñoUnread: 0,
    paseadorUnread: 0,
    messages: [
      { id: 1, sender: 'dueño', text: 'Gracias por el paseo de hoy. Toto llegó muy contento.', time: '18:20' },
      { id: 2, sender: 'paseador', text: '¡Me alegro mucho! Es un placer pasear con Toto.', time: '18:24' }
    ]
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('dueño');
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // dueño App State
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPet, setSelectedPet] = useState(INITIAL_PETS[0]);
  const [dueñoTab, setdueñoTab] = useState('home'); // 'home' | 'book' | 'active' | 'chat' | 'history' | 'profile'
  const [walkType, setWalkType] = useState('normal'); // 'express' | 'normal' | 'premium'
  const [selectedpaseador, setSelectedpaseador] = useState(paseadorS[0]);
  const [selectedMapWalkerId, setSelectedMapWalkerId] = useState<number | null>(null);
  const [hoveredMapWalkerId, setHoveredMapWalkerId] = useState<number | null>(null);
  const [selectedReviewsWalkerId, setSelectedReviewsWalkerId] = useState<number | null>(null);
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
  const [walkerReviews, setWalkerReviews] = useState<WalkerReview[]>([]);
  const [walkerRatings, setWalkerRatings] = useState<Record<number, number>>(() =>
    paseadorS.reduce<Record<number, number>>((ratings, walker) => {
      ratings[walker.id] = walker.rating;
      return ratings;
    }, {})
  );
  const [walkerReviewCounts, setWalkerReviewCounts] = useState<Record<number, number>>(() =>
    paseadorS.reduce<Record<number, number>>((counts, walker) => {
      counts[walker.id] = 48;
      return counts;
    }, {})
  );
  const [walkReviewRatings, setWalkReviewRatings] = useState<Record<number, number>>({});
  const [walkReviewComments, setWalkReviewComments] = useState<Record<number, string>>({});
  const [isImmediate, setIsImmediate] = useState(true);

  // Shared Active Walk State
  const [activeWalks, setActiveWalks] = useState<ActiveWalk[]>([]);

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selecteddueñoChatId, setSelecteddueñoChatId] = useState<number | null>(null);
  const [dueñoChatDraft, setdueñoChatDraft] = useState('');

  // paseador App State
  const [isOnline, setIsOnline] = useState(true);
  const [paseadorEarnings, setpaseadorEarnings] = useState(52400);
  const [walkerWalkCounts, setWalkerWalkCounts] = useState<Record<number, number>>(() =>
    paseadorS.reduce<Record<number, number>>((counts, walker) => {
      counts[walker.id] = walker.walksDone;
      return counts;
    }, {})
  );
  const completedWalksProcessed = useRef(new Set<number>());
  const [paseadorTab, setpaseadorTab] = useState<'home' | 'chats'>('home');
  const [selectedpaseadorChatId, setSelectedpaseadorChatId] = useState<number | null>(null);
  const [paseadorChatDraft, setpaseadorChatDraft] = useState('');

  const appendConversationMessage = useCallback((
    conversationId: number,
    sender: UserRole,
    text: string,
    isReport = false
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message = { id: Date.now(), sender, text, time, isReport };
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              time,
              dueñoUnread: sender === 'paseador' ? conversation.dueñoUnread + 1 : 0,
              paseadorUnread: sender === 'dueño' ? conversation.paseadorUnread + 1 : 0,
              messages: [...conversation.messages, message]
            }
          : conversation
      )
    );
  }, []);

  useEffect(() => {
    activeWalks
      .filter((walk) => walk.status === 'finished' && !completedWalksProcessed.current.has(walk.id))
      .forEach((walk) => {
        completedWalksProcessed.current.add(walk.id);
        setpaseadorEarnings((previous) => previous + walk.price);
        setWalkerWalkCounts((previous) => ({
          ...previous,
          [walk.paseador.id]: (previous[walk.paseador.id] ?? walk.paseador.walksDone) + 1
        }));
        appendConversationMessage(
          walk.conversationId,
          'paseador',
          `¡Paseo finalizado! ${walk.pet.name} ya volvió a casa. Gracias por confiar en mí 🐾`
        );
      });
  }, [activeWalks, appendConversationMessage]);

  const walkersWithWalkCounts = paseadorS.map((walker) => ({
    ...walker,
    walksDone: walkerWalkCounts[walker.id] ?? walker.walksDone,
    rating: walkerRatings[walker.id] ?? walker.rating
  }));
  const currentWalker = role === 'paseador' && currentUser?.role === 'paseador'
    ? walkersWithWalkCounts.find((walker) => walker.id === currentUser.walkerId) ?? null
    : null;
  const currentWalkerReviews: ReviewDisplay[] = currentWalker
    ? [
        ...walkerReviews
          .filter((review) => review.walkerId === currentWalker.id)
          .reverse()
          .map(({ id, walkId, rating, date, comment }) => ({ id, walkId, rating, date, comment })),
        ...paseador_REVIEWS.map((review) => ({ ...review }))
      ]
    : paseador_REVIEWS;
  const visibleConversations = conversations.filter((conversation) =>
    role === 'dueño'
      ? currentUser?.role === 'dueño' && conversation.ownerId === currentUser.id
      : currentUser?.role === 'paseador' && conversation.paseadorId === currentUser.walkerId
  );
  const ownerActiveWalks = role === 'dueño' && currentUser?.role === 'dueño'
    ? activeWalks.filter((walk) => walk.ownerId === currentUser.id)
    : [];
  const visibleActiveWalk = role === 'dueño'
    ? [...ownerActiveWalks].reverse().find((walk) => walk.pet.id === selectedPet.id) ?? null
    : null;
  const walkerActiveWalks = role === 'paseador' && currentUser?.role === 'paseador'
    ? activeWalks.filter((walk) => walk.paseador.id === currentUser.walkerId)
    : [];
  const selectedMapWalker = walkersWithWalkCounts.find((walker) => walker.id === selectedMapWalkerId) ?? null;
  const displayedMapWalkerId = hoveredMapWalkerId ?? selectedMapWalkerId;
  const filteredWalkers = walkersWithWalkCounts.filter((walker) =>
    !neighborhoodFilter || walker.neighborhoods.includes(neighborhoodFilter)
  );
  const selectedReviewsWalker = walkersWithWalkCounts.find((walker) => walker.id === selectedReviewsWalkerId) ?? null;
  const selectedWalkerReviews: ReviewDisplay[] = selectedReviewsWalker
    ? [
        ...walkerReviews
          .filter((review) => review.walkerId === selectedReviewsWalker.id)
          .reverse()
          .map(({ id, walkId, rating, date, comment }) => ({ id, walkId, rating, date, comment })),
        ...paseador_REVIEWS.map((review) => ({ ...review }))
      ]
    : [];
  const submittedReviewForWalk = visibleActiveWalk
    ? walkerReviews.find((review) => review.walkId === visibleActiveWalk.id)
    : undefined;

  // Timer simulation for active walk
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (activeWalks.some((walk) => walk.status === 'in_progress')) {
      interval = setInterval(() => {
        setActiveWalks((previous) => previous.map((walk) => {
          if (walk.status !== 'in_progress') return walk;
          const nextTime = walk.timeElapsed + 1;
          const totalSec = walk.durationMinutes * 60;
          const progress = Math.min(100, Math.floor((nextTime / totalSec) * 100));
          const updatedPhotos = [...walk.photos];
          if (nextTime === 10 && updatedPhotos.length === 0) {
            updatedPhotos.push({ time: "16:10", text: `¡Llegamos al Parque Sarmiento! ${walk.pet.name} está feliz disfrutando del sol.`, img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80" });
          }

          return progress >= 100
            ? { ...walk, timeElapsed: nextTime, routeProgress: 100, status: 'finished', photos: updatedPhotos }
            : { ...walk, timeElapsed: nextTime, routeProgress: progress, photos: updatedPhotos };
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWalks]);

  // Handle Request Walk (dueño)
  const handleRequestWalk = () => {
    if (currentUser?.role !== 'dueño') return;
    const existingWalk = [...activeWalks].reverse().find((walk) =>
      walk.ownerId === currentUser.id
      && walk.pet.id === selectedPet.id
      && walk.status !== 'finished'
    );
    if (existingWalk) {
      setdueñoTab('active');
      return;
    }

    const conversation = conversations.find((item) =>
      item.ownerId === currentUser.id && item.paseadorId === selectedpaseador.id
    );
    const conversationId = conversation?.id ?? Date.now() + 1;

    if (!conversation) {
      setConversations((previous) => [
        {
          id: conversationId,
          ownerId: currentUser.id,
          paseadorId: selectedpaseador.id,
          paseadorName: selectedpaseador.name,
          paseadorAvatar: selectedpaseador.avatar,
          dueñoName: currentUser.name,
          petName: selectedPet.name,
          petPhoto: selectedPet.photo,
          time: 'Ahora',
          dueñoUnread: 0,
          paseadorUnread: 0,
          messages: []
        },
        ...previous
      ]);
    }

    const newWalk: ActiveWalk = {
      id: Date.now(),
      ownerId: currentUser.id,
      conversationId,
      pet: selectedPet,
      paseador: selectedpaseador,
      type: walkType === 'express' ? 'Paseo Express (30m)' : walkType === 'normal' ? 'Paseo Normal (45m)' : 'Premium Individual (60m)',
      durationMinutes: walkType === 'express' ? 30 : walkType === 'normal' ? 45 : 60,
      price: walkType === 'express' ? 2800 : walkType === 'normal' ? 3500 : 5000,
      timeElapsed: 0,
      routeProgress: 0,
      status: 'requested',
      photos: []
    };
    setActiveWalks((previous) => [...previous, newWalk]);
    setdueñoTab('active');
  };

  // Handle paseador Accepts Request
  const handleAcceptRequest = (walkId: number) => {
    const walk = activeWalks.find((item) => item.id === walkId);
    if (
      walk
      && currentUser?.role === 'paseador'
      && walk.paseador.id === currentUser.walkerId
      && walk.status === 'requested'
    ) {
      setActiveWalks((previous) => previous.map((item) =>
        item.id === walkId ? { ...item, status: 'in_progress' } : item
      ));
      appendConversationMessage(
        walk.conversationId,
        'paseador',
        `¡Paseo aceptado! Voy camino a buscar a ${walk.pet.name}.`
      );
    }
  };

  // Handle Add Photo/Report (paseador)
  const handleAddpaseadorReport = (walkId: number, type: 'photo' | 'poop') => {
    const walk = activeWalks.find((item) => item.id === walkId);
    if (
      !walk
      || currentUser?.role !== 'paseador'
      || walk.paseador.id !== currentUser.walkerId
      || walk.status !== 'in_progress'
    ) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReport = type === 'photo' 
      ? { time: timeStr, text: "¡Parada de descanso con agua cerca del Buen Pastor!", img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=400&q=80" }
      : { time: timeStr, text: "💩 Realizó sus necesidades de forma normal en Plaza España.", img: null };
    
    setActiveWalks((previous) => previous.map((item) =>
      item.id === walkId ? { ...item, photos: [newReport, ...item.photos] } : item
    ));

    // Send automated chat notification
    appendConversationMessage(
      walk.conversationId,
      'paseador',
      `[REPORTE DE PASEO]: ${newReport.text}`,
      true
    );
  };

  const handleFinishWalk = (walkId: number) => {
    const walk = activeWalks.find((item) => item.id === walkId);
    if (
      !walk
      || currentUser?.role !== 'paseador'
      || walk.paseador.id !== currentUser.walkerId
      || walk.status !== 'in_progress'
    ) return;
    setActiveWalks((previous) => previous.map((item) =>
      item.id === walkId ? { ...item, status: 'finished' } : item
    ));
  };

  const handleSubmitWalkReview = (walkId: number) => {
    const walk = activeWalks.find((item) => item.id === walkId);
    const rating = walkReviewRatings[walkId] ?? 0;
    if (
      !walk
      || currentUser?.role !== 'dueño'
      || walk.ownerId !== currentUser.id
      || walk.status !== 'finished'
      || rating < 1
      || rating > 5
      || walkerReviews.some((review) => review.walkId === walkId)
    ) return;

    const review: WalkerReview = {
      id: Date.now(),
      walkId,
      walkerId: walk.paseador.id,
      rating,
      date: 'Hoy',
      comment: walkReviewComments[walkId]?.trim() ?? ''
    };
    const previousCount = walkerReviewCounts[walk.paseador.id] ?? 48;
    const previousRating = walkerRatings[walk.paseador.id] ?? walk.paseador.rating;
    setWalkerReviews((previous) => [...previous, review]);
    setWalkerRatings((previous) => ({
      ...previous,
      [walk.paseador.id]: Number(((previousRating * previousCount + rating) / (previousCount + 1)).toFixed(1))
    }));
    setWalkerReviewCounts((previous) => ({
      ...previous,
      [walk.paseador.id]: previousCount + 1
    }));
    setSelectedReviewsWalkerId(walk.paseador.id);
    setdueñoTab('reviews');
  };

  const handleClearWalk = (walkId: number) => {
    const walk = activeWalks.find((item) => item.id === walkId);
    if (
      !walk
      || currentUser?.role !== 'paseador'
      || walk.paseador.id !== currentUser.walkerId
      || walk.status !== 'requested'
    ) return;
    setActiveWalks((previous) => previous.filter((item) => item.id !== walkId));
    setdueñoTab('home');
  };

  const handleSendpaseadorChatMessage = () => {
    const text = paseadorChatDraft.trim();
    if (!text || selectedpaseadorChatId === null || currentUser?.role !== 'paseador') return;

    const conversation = conversations.find((item) => item.id === selectedpaseadorChatId);
    if (!conversation || conversation.paseadorId !== currentUser.walkerId) return;

    appendConversationMessage(selectedpaseadorChatId, 'paseador', text);
    setpaseadorChatDraft('');
  };

  const handleSenddueñoChatMessage = () => {
    const text = dueñoChatDraft.trim();
    if (!text || selecteddueñoChatId === null || currentUser?.role !== 'dueño') return;

    const conversation = conversations.find((item) => item.id === selecteddueñoChatId);
    if (!conversation || conversation.ownerId !== currentUser.id) return;

    appendConversationMessage(selecteddueñoChatId, 'dueño', text);
    setdueñoChatDraft('');
  };

  const selecteddueñoChat = conversations.find((chat) => chat.id === selecteddueñoChatId);
  const selectedpaseadorChat = conversations.find((chat) => chat.id === selectedpaseadorChatId);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPassword('');
    setLoginError('');
    setdueñoTab('home');
    setpaseadorTab('home');
    setSelecteddueñoChatId(null);
    setSelectedpaseadorChatId(null);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = DEMO_ACCOUNTS.find((candidate) =>
      candidate.role === role
      && candidate.email.toLowerCase() === email.trim().toLowerCase()
      && candidate.password === password
    );

    if (!account) {
      setLoginError('No encontramos una cuenta con ese correo, contraseña y rol.');
      return;
    }

    setCurrentUser(account);
    setRole(account.role);
    if (account.role === 'dueño') {
      setPets(account.pets);
      setSelectedPet(account.pets[0]);
    }
    setLoginError('');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="pawgo-login-screen">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="pawgo-brand-mark">
              <Dog className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">PawGo</h1>
            <p className="text-sm text-slate-400 mt-1">La felicidad de tu mascota, a la palma de tu mano.</p>
          </div>

          <form
            onSubmit={handleLogin}
            className={`pawgo-login-card ${
              role === 'dueño'
                ? 'pawgo-login-card-dueño'
                : 'pawgo-login-card-paseador'
            }`}
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">Iniciar sesión</h2>
              <p className="text-xs text-slate-500 mt-1">Elegí cómo querés ingresar a PawGo.</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Ingresar como</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setRole('dueño'); setLoginError(''); }}
                  aria-pressed={role === 'dueño'}
                  className={`pawgo-login-role ${
                    role === 'dueño'
                    ? 'pawgo-login-role-dueño'
                    : 'pawgo-login-role-idle-dueño'
                  }`}
                >
                  <User className="w-4 h-4" /> Dueño
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('paseador'); setLoginError(''); }}
                  aria-pressed={role === 'paseador'}
                  className={`pawgo-login-role ${
                    role === 'paseador'
                    ? 'pawgo-login-role-paseador'
                    : 'pawgo-login-role-idle-paseador'
                  }`}
                >
                  <Dog className="w-4 h-4" /> Paseador
                </button>
              </div>
            </div>

            <label className="block">
              <span className="pawgo-field-label">Correo electrónico</span>
              <span className="pawgo-input-wrap">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setLoginError(''); }}
                  placeholder="tu@email.com"
                  className="pawgo-input"
                />
              </span>
            </label>

            <label className="block">
              <span className="pawgo-field-label">Contraseña</span>
              <span className="pawgo-input-wrap">
                <LockKeyhole className="w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setLoginError(''); }}
                  placeholder="Ingresá tu contraseña"
                  className="pawgo-input"
                />
              </span>
            </label>

            <button
              type="submit"
              className={`pawgo-login-submit ${
                role === 'dueño'
                  ? 'pawgo-login-submit-dueño'
                  : 'pawgo-login-submit-paseador'
              }`}
            >
              <span>Entrar como {role === 'dueño' ? 'dueño' : 'paseador'}</span>
            </button>
            {loginError && (
              <p role="alert" className="text-center text-xs font-semibold text-red-600">
                {loginError}
              </p>
            )}
            <p className="text-center text-[11px] text-slate-400">
              Elegí una cuenta demo para ingresar:
            </p>
            <details className="text-xs text-slate-600">
              <summary className="cursor-pointer font-bold text-center">Ver usuarios y contraseñas</summary>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="font-bold text-slate-800 mb-1">Dueños</p>
                  {OWNER_ACCOUNTS.map((account) => (
                    <p key={account.id}>{account.email} / {account.password}</p>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">Paseadores</p>
                  {WALKER_ACCOUNTS.map((account) => (
                    <p key={account.id}>{account.email} / {account.password}</p>
                  ))}
                </div>
              </div>
            </details>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pawgo-app-shell">
      
      {/* GLOBAL TOP NAVIGATION */}
      <header className="pawgo-header">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-violet-600 to-amber-500 p-2 rounded-xl text-white shadow">
            <Dog className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              PawGo
            </span>
            <span className="text-[10px] block text-amber-400 font-medium -mt-1">📍 Córdoba, Argentina</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`pawgo-role-badge ${
            role === 'dueño' ? 'pawgo-role-badge-dueño' : 'pawgo-role-badge-paseador'
          }`}>
            {role === 'dueño' ? 'Dueño' : 'Paseador'}
          </span>
          <button
            onClick={handleLogout}
            className="pawgo-logout"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (MOBILE FRAME DISPLAY) */}
      <main className="pawgo-main">
        
        {/* ========================================================================= */}
        {/* VISTA DEL DUEÑO (dueño VIEW) */}
        {/* ========================================================================= */}
        {role === 'dueño' && (
          <div className="pawgo-dueño-view">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-800 text-white p-5 rounded-b-3xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div>
                  <span className="text-violet-200 text-xs font-medium">
                    ¡Hola, {currentUser?.role === 'dueño' ? currentUser.name.split(' ')[0] : 'familia'}!
                  </span>
                  <h1 className="text-xl font-bold">Paseos en Córdoba 🐾</h1>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Pet selector pills */}
              <div className="flex gap-2 overflow-x-auto pt-2 pb-1 relative z-10 scrollbar-none">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                      selectedPet.id === pet.id 
                        ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300' 
                        : 'bg-white/15 text-white hover:bg-white/25'
                    }`}
                  >
                    <span>{pet.photo}</span>
                    <span>{pet.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: HOME / MAP */}
            {dueñoTab === 'home' && (
              <div className="p-4 space-y-5 flex-1">
                {/* Active Walk Floating Notification Banner */}
                {visibleActiveWalk && (
                  <div 
                    onClick={() => setdueñoTab('active')}
                    className={`text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer ${
                      visibleActiveWalk.status === 'finished'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : visibleActiveWalk.status === 'requested'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Navigation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">
                          {visibleActiveWalk.status === 'finished'
                            ? 'Paseo finalizado'
                            : visibleActiveWalk.status === 'requested'
                            ? 'Esperando confirmación'
                            : 'Paseo en progreso'}
                        </p>
                        <p className="text-sm font-bold">{visibleActiveWalk.pet.name} con {visibleActiveWalk.paseador.name}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}

                {/* Pet Profile Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedPet.photo}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{selectedPet.name}</h3>
                        <p className="text-xs text-slate-500">{selectedPet.breed} • {selectedPet.age} años</p>
                      </div>
                    </div>
                    <span className="bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      Energía {selectedPet.energy}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                    "{selectedPet.notes}"
                  </p>
                </div>

                {/* Córdoba map mock */}
                <div
                  onMouseLeave={() => setHoveredMapWalkerId(null)}
                  className="bg-slate-100 rounded-3xl p-3 border border-slate-200 shadow-inner relative overflow-hidden h-[380px] flex flex-col justify-between"
                >
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    {[
                      [5269, 9699],
                      [5270, 9699],
                      [5269, 9700],
                      [5270, 9700]
                    ].map(([x, y]) => (
                      <img
                        key={`${x}-${y}`}
                        src={`https://tile.openstreetmap.org/14/${x}/${y}.png`}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                  
                  {/* Map Header Overlay */}
                  <div className="relative z-10 flex items-center justify-between bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-sm text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <MapPin className="w-4 h-4 text-violet-600" />
                      <span>Nueva Córdoba / Güemes</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      🇦🇷 Córdoba Capital
                    </span>
                  </div>

                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="absolute z-10 bottom-14 right-3 rounded bg-white/90 px-1.5 py-1 text-[8px] text-slate-700"
                    aria-label="Créditos del mapa de Córdoba"
                  >
                    © OpenStreetMap
                  </a>

                  {/* Simulated paseador Markers on Map */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {walkersWithWalkCounts.map((w) => (
                      <div
                        key={w.id} 
                        onMouseEnter={() => setHoveredMapWalkerId(w.id)}
                        onMouseLeave={() => setHoveredMapWalkerId(null)}
                        className="absolute pointer-events-auto"
                        style={{ left: w.mapPosition.left, top: w.mapPosition.top }}
                      >
                        {displayedMapWalkerId === w.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-xl px-3 py-2 shadow-xl border border-slate-200 whitespace-nowrap text-center">
                            <p className="font-bold text-xs text-slate-900">{w.name}</p>
                            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-600 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-slate-800">{w.rating}</span>
                              <span>· {w.walksDone} viajes</span>
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          aria-label={`Ver datos de ${w.name}`}
                          aria-pressed={selectedMapWalkerId === w.id}
                          onFocus={() => setHoveredMapWalkerId(w.id)}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedMapWalkerId(w.id);
                            setSelectedpaseador(w);
                          }}
                          className={`block rounded-full bg-white p-1 shadow-lg ring-4 transition hover:scale-110 ${selectedMapWalkerId === w.id ? 'ring-amber-400' : 'ring-violet-400'}`}
                        >
                          <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-full object-cover" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      if (selectedMapWalker) setSelectedpaseador(selectedMapWalker);
                      setdueñoTab('book');
                    }}
                    className="relative z-10 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Solicitar Paseo en Córdoba
                  </button>
                </div>

                {/* Near paseadors List */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                    <span>Paseadores Verificados en Córdoba</span>
                  </h3>
                  <label className="block mb-3">
                    <span className="block text-xs font-semibold text-slate-600 mb-1.5">Filtrar por barrio</span>
                    <select
                      aria-label="Filtrar paseadores por barrio"
                      value={neighborhoodFilter}
                      onChange={(event) => setNeighborhoodFilter(event.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <option value="">Todos los barrios</option>
                      {CORDOBA_NEIGHBORHOODS.map((neighborhood) => (
                        <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                      ))}
                    </select>
                  </label>
                  <div className="space-y-2.5">
                    {filteredWalkers.map((w) => (
                      <div key={w.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-violet-300 transition">
                        <div className="flex items-center gap-3">
                          <img src={w.avatar} alt={w.name} className="w-11 h-11 rounded-2xl object-cover" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-xs text-slate-900">{w.name}</h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <p className="text-[11px] text-slate-500">{w.distance} • {w.walksDone} paseos</p>
                            <p className="text-[10px] text-slate-400">{w.neighborhoods.join(' · ')}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs font-bold text-slate-800">{w.rating}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded ml-1 font-medium">{w.badge}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedReviewsWalkerId(w.id);
                              setdueñoTab('reviews');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                          >
                            Reseñas
                          </button>
                          <button 
                            onClick={() => { setSelectedpaseador(w); setdueñoTab('book'); }}
                            className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                          >
                            Elegir
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredWalkers.length === 0 && (
                      <p className="text-xs text-slate-500 text-center bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        Todavía no hay paseadores mock disponibles en {neighborhoodFilter}.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {dueñoTab === 'reviews' && selectedReviewsWalker && (
              <section className="pawgo-dueño-content">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setdueñoTab('home')}
                    className="p-1.5 bg-slate-100 rounded-xl hover:bg-slate-200"
                    aria-label="Volver al inicio"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                  </button>
                  <h2 className="font-bold text-slate-900 text-base">Reseñas del paseador</h2>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-2xl border border-violet-200 flex items-center gap-3">
                  <img src={selectedReviewsWalker.avatar} alt={selectedReviewsWalker.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{selectedReviewsWalker.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-slate-900">{selectedReviewsWalker.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-500">· {walkerReviewCounts[selectedReviewsWalker.id] ?? 48} reseñas</span>
                    </div>
                  </div>
                </div>

                <div className="pawgo-review-list">
                  {selectedWalkerReviews.map((review) => (
                    <article key={review.walkId ? `walk-${review.walkId}` : `mock-${review.id}`} className="pawgo-review">
                      <div className="pawgo-review-heading">
                        <div>
                          <p className="pawgo-review-author">Usuario anónimo</p>
                          <p className="pawgo-review-date">{review.date}</p>
                        </div>
                        <div className="pawgo-review-rating" aria-label={`${review.rating} de 5 estrellas`}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              className={`pawgo-review-star ${index < review.rating ? 'pawgo-review-star-filled' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="pawgo-review-comment">{review.comment || 'Sin comentario.'}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* TAB CONTENT: BOOKING FORM */}
            {dueñoTab === 'book' && (
              <div className="pawgo-dueño-content">
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setdueñoTab('home')} className="p-1.5 bg-slate-100 rounded-xl hover:bg-slate-200">
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                  </button>
                  <h2 className="font-bold text-slate-900 text-base">Paseo para {selectedPet.name} en Córdoba</h2>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-3.5 rounded-2xl border border-violet-200 flex items-center gap-3">
                  <img src={selectedpaseador.avatar} alt={selectedpaseador.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-sm text-slate-900">{selectedpaseador.name}</h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-slate-600">{selectedpaseador.bio}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Modalidad de Reserva</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsImmediate(true)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        isImmediate ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" /> Inmediato (Ahora)
                    </button>
                    <button
                      onClick={() => setIsImmediate(false)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                        !isImmediate ? 'bg-violet-600 text-white border-violet-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Calendar className="w-4 h-4" /> Programar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Tipo de Paseo</label>
                  <div className="space-y-2">
                    {[
                      { id: 'express', name: 'Paseo Express', time: '30 mins', desc: 'Recorrido ágil cerca del domicilio.', price: 2800 },
                      { id: 'normal', name: 'Paseo Estándar', time: '45 mins', desc: 'Circuito Parque Sarmiento o Buen Pastor.', price: 3500 },
                      { id: 'premium', name: 'Premium Exclusivo', time: '60 mins', desc: 'Dedicación 100% individual de alta energía.', price: 5000 }
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setWalkType(type.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          walkType === type.id 
                            ? 'bg-violet-50 border-violet-600 ring-2 ring-violet-400' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900">{type.name}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">{type.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{type.desc}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">${type.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Método de pago</span>
                    <span className="font-bold text-violet-700 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Mercado Pago (•••• 4920)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total a abonar</span>
                    <span className="text-base text-violet-700">
                      ${walkType === 'express' ? 2800 : walkType === 'normal' ? 3500 : 5000} ARS
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRequestWalk}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform active:scale-95"
                >
                  <CheckCircle className="w-5 h-5 text-amber-300" /> Confirmar y Solicitar Paseo
                </button>
              </div>
            )}

            {/* TAB CONTENT: ACTIVE WALK TRACKER */}
            {dueñoTab === 'active' && (
              <div className="pawgo-dueño-content">
                {!visibleActiveWalk ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
                      <Dog className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800">No hay ningún paseo activo</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">Solicita un paseo desde el inicio para monitorearlo en tiempo real.</p>
                    <button 
                      onClick={() => setdueñoTab('home')}
                      className="bg-violet-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Ir al Inicio
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Status Card Header */}
                    <div className={`p-4 rounded-3xl text-white shadow-lg transition-all ${
                      visibleActiveWalk.status === 'requested' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : visibleActiveWalk.status === 'in_progress'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-700'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                          {visibleActiveWalk.status === 'requested' && "Buscando Confirmación"}
                          {visibleActiveWalk.status === 'in_progress' && "Paseo En Curso • Córdoba"}
                          {visibleActiveWalk.status === 'finished' && "Paseo Finalizado Exitosamente"}
                        </span>
                        <Clock className="w-4 h-4" />
                      </div>

                      <h2 className="text-lg font-extrabold">
                        {visibleActiveWalk.status === 'requested' && "Esperando respuesta del paseador..."}
                        {visibleActiveWalk.status === 'in_progress' && `${visibleActiveWalk.pet.name} está en el Parque Sarmiento`}
                        {visibleActiveWalk.status === 'finished' && `¡${visibleActiveWalk.pet.name} volvió a casa!`}
                      </h2>

                      {visibleActiveWalk.status === 'in_progress' && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Progreso del recorrido por GPS</span>
                            <span>{visibleActiveWalk.routeProgress}%</span>
                          </div>
                          <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-300 h-full transition-all duration-500" 
                              style={{ width: `${visibleActiveWalk.routeProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cordoba Map View for active walk */}
                    <div className="bg-slate-100 rounded-3xl h-56 relative overflow-hidden border border-slate-200 shadow-inner flex flex-col justify-between p-3">
                      <div className="absolute inset-0 bg-slate-200 opacity-90 flex flex-col justify-between p-2">
                        <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
                          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#cbd5e1" strokeWidth="16" />
                          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#cbd5e1" strokeWidth="16" />
                          <circle cx="50%" cy="35%" r="35" fill="#dcfce7" stroke="#86efac" strokeWidth="2" />
                          <text x="41%" y="37%" fill="#15803d" fontSize="9" fontWeight="bold">Parque Sarmiento</text>
                        </svg>
                      </div>

                      <div className="relative z-10 flex-1 flex items-center justify-center">
                        <div className="bg-violet-600 text-white p-2 rounded-full shadow-2xl ring-8 ring-violet-400/40 animate-bounce">
                          <Dog className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={visibleActiveWalk.paseador.avatar} alt="paseador" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{visibleActiveWalk.paseador.name}</p>
                            <p className="text-[10px] text-slate-500">Av. Hipólito Yrigoyen / Nueva Córdoba</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelecteddueñoChatId(visibleActiveWalk.conversationId);
                              setdueñoTab('chat');
                            }}
                            className="p-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center gap-1 text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Chat
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Photos and Event Updates Timeline */}
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-violet-600" />
                        <span>Actualizaciones de la Mascota</span>
                      </h3>
                      {visibleActiveWalk.photos.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                          Aún no se han enviado fotos del paseo...
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {visibleActiveWalk.photos.map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
                              {item.img ? (
                                <img src={item.img} alt="report" className="w-14 h-14 rounded-xl object-cover" />
                              ) : (
                                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xl">
                                  💩
                                </div>
                              )}
                              <div className="flex-1">
                                <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">{item.time}</span>
                                <p className="text-xs text-slate-800 font-medium mt-1">{item.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {visibleActiveWalk.status === 'finished' && (
                      submittedReviewForWalk ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                          <p className="font-bold text-sm text-emerald-800">¡Gracias por tu reseña!</p>
                          <p className="text-xs text-emerald-700">Tu puntuación ya aparece en las reseñas de {visibleActiveWalk.paseador.name}.</p>
                          <button
                            onClick={() => {
                              setSelectedReviewsWalkerId(visibleActiveWalk.paseador.id);
                              setdueñoTab('reviews');
                            }}
                            className="text-xs font-bold text-violet-700 underline"
                          >
                            Ver reseñas del paseador
                          </button>
                        </div>
                      ) : (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmitWalkReview(visibleActiveWalk.id);
                          }}
                          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3"
                        >
                          <div>
                            <h3 className="font-bold text-sm text-slate-900">¿Cómo estuvo el paseo?</h3>
                            <p className="text-xs text-slate-600">Calificá a {visibleActiveWalk.paseador.name}.</p>
                          </div>
                          <div className="flex items-center gap-1" role="group" aria-label="Calificación del paseo">
                            {Array.from({ length: 5 }, (_, index) => {
                              const rating = index + 1;
                              const selectedRating = walkReviewRatings[visibleActiveWalk.id] ?? 0;
                              return (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => setWalkReviewRatings((previous) => ({
                                    ...previous,
                                    [visibleActiveWalk.id]: rating
                                  }))}
                                  aria-label={`${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`}
                                  aria-pressed={selectedRating === rating}
                                  className="p-1"
                                >
                                  <Star className={`w-7 h-7 transition-colors ${rating <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                </button>
                              );
                            })}
                          </div>
                          <label className="block">
                            <span className="block text-xs font-semibold text-slate-700 mb-1">Comentario (opcional)</span>
                            <textarea
                              value={walkReviewComments[visibleActiveWalk.id] ?? ''}
                              onChange={(event) => setWalkReviewComments((previous) => ({
                                ...previous,
                                [visibleActiveWalk.id]: event.target.value
                              }))}
                              rows={3}
                              maxLength={400}
                              placeholder="Contanos cómo fue la experiencia..."
                              className="w-full resize-none rounded-xl border border-amber-200 bg-white p-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-amber-300"
                            />
                          </label>
                          <button
                            type="submit"
                            disabled={!walkReviewRatings[visibleActiveWalk.id]}
                            className="w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Enviar reseña
                          </button>
                        </form>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CHAT */}
            {dueñoTab === 'chat' && (
              <section className="pawgo-dueño-content">
                {selecteddueñoChatId === null ? (
                  <>
                    <div className="pawgo-paseador-chat-heading">
                      <div>
                        <h2 className="pawgo-paseador-chat-title">Chats</h2>
                        <p className="pawgo-paseador-chat-subtitle">Conversaciones con tus paseadores</p>
                      </div>
                      <MessageSquare className="w-5 h-5 text-violet-500" />
                    </div>

                    <div className="pawgo-paseador-chat-list">
                      {visibleConversations.map((chat) => {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        return (
                          <button
                            key={chat.id}
                            onClick={() => {
                              setSelecteddueñoChatId(chat.id);
                              setConversations((previous) =>
                                previous.map((conversation) =>
                                  conversation.id === chat.id ? { ...conversation, dueñoUnread: 0 } : conversation
                                )
                              );
                            }}
                            className="pawgo-paseador-chat-list-item"
                          >
                            <span className="pawgo-paseador-chat-avatar">{chat.petPhoto}</span>
                            <span className="pawgo-paseador-chat-preview">
                              <span className="pawgo-paseador-chat-preview-top">
                                <span>
                                  <span className="pawgo-paseador-chat-dueño">{chat.paseadorName}</span>
                                  <span className="pawgo-paseador-chat-pet">Paseador de {chat.petName}</span>
                                </span>
                                <span className="pawgo-paseador-chat-time">{chat.time}</span>
                              </span>
                              <span className="pawgo-paseador-chat-last-message">{lastMessage?.text}</span>
                            </span>
                            {chat.dueñoUnread > 0 && (
                              <span className="pawgo-paseador-chat-unread">{chat.dueñoUnread}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : selecteddueñoChat ? (
                  <div className="pawgo-paseador-chat-window">
                    <div className="pawgo-paseador-chat-conversation-header">
                      <button
                        onClick={() => setSelecteddueñoChatId(null)}
                        className="pawgo-paseador-chat-back"
                        aria-label="Volver a la lista de chats"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <img
                        src={selecteddueñoChat.paseadorAvatar}
                        alt={selecteddueñoChat.paseadorName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="pawgo-paseador-chat-dueño">{selecteddueñoChat.paseadorName}</h2>
                        <p className="pawgo-paseador-chat-pet">Paseador de {selecteddueñoChat.petName}</p>
                      </div>
                    </div>

                    <div className="pawgo-paseador-chat-messages">
                      {selecteddueñoChat.messages.map((message) => {
                        const isdueñoMessage = message.sender === 'dueño';
                        return (
                          <div
                            key={message.id}
                            className={`pawgo-paseador-message-row ${
                              isdueñoMessage ? 'pawgo-paseador-message-row-mine' : ''
                            }`}
                          >
                            <div
                              className={`pawgo-paseador-message ${
                                message.isReport
                                  ? 'pawgo-dueño-message-report'
                                  : isdueñoMessage
                                    ? 'pawgo-dueño-message-mine'
                                    : 'pawgo-paseador-message-theirs'
                              }`}
                            >
                              <p>{message.text}</p>
                              <span>{message.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form
                      className="pawgo-paseador-chat-compose"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleSenddueñoChatMessage();
                      }}
                    >
                      <input
                        type="text"
                        value={dueñoChatDraft}
                        onChange={(event) => setdueñoChatDraft(event.target.value)}
                        placeholder="Escribí un mensaje..."
                        aria-label="Mensaje del chat"
                        className="pawgo-paseador-chat-input"
                      />
                      <button
                        type="submit"
                        disabled={!dueñoChatDraft.trim()}
                        className="pawgo-dueño-chat-send"
                        aria-label="Enviar mensaje"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ) : null}
              </section>
            )}

            {/* TAB CONTENT: HISTORY */}
            {dueñoTab === 'history' && (
              <div className="pawgo-dueño-content">
                <h2 className="font-bold text-slate-900 text-base">Historial de Paseos en Córdoba</h2>
                <div className="space-y-3">
                  {PAST_WALKS.map((w) => (
                    <div key={w.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{w.date}</span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">Paseo con {w.paseadorName}</h4>
                          <p className="text-xs text-slate-500">Mascota: {w.petName} • {w.duration}</p>
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">${w.price} ARS</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-800">{w.rating}.0</span>
                        </div>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFILE */}
            {dueñoTab === 'profile' && (
              <div className="pawgo-dueño-content">
                <div className="text-center space-y-2 py-3">
                  <div className="w-20 h-20 bg-violet-600 text-white rounded-full mx-auto flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-violet-200">
                    {currentUser?.role === 'dueño'
                      ? currentUser.name.split(' ').map((part) => part[0]).slice(0, 2).join('')
                      : 'U'}
                  </div>
                  <h2 className="font-bold text-slate-900 text-base">
                    {currentUser?.role === 'dueño' ? currentUser.name : ''}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {currentUser?.role === 'dueño' ? currentUser.email : 'Nueva Córdoba, Córdoba Capital'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-700">Mis Mascotas</h3>
                  {pets.map((p) => (
                    <div key={p.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.photo}</span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-500">{p.breed}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full font-bold">Editar</span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-xs text-slate-700">Métodos de Pago</h3>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-violet-600" /> Mercado Pago (•••• 4920)
                    </span>
                    <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                </div>
              </div>
            )}

            {/* dueño BOTTOM TAB BAR */}
            <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 flex justify-around items-center z-40">
              {[
                { id: 'home', label: 'Inicio', icon: MapPin },
                { id: 'active', label: 'En Vivo', icon: Navigation, badge: visibleActiveWalk ? '!' : null },
                {
                  id: 'chat',
                  label: 'Chat',
                  icon: MessageSquare,
                  badge: visibleConversations.some((conversation) => conversation.dueñoUnread > 0) ? '!' : null
                },
                { id: 'history', label: 'Paseos', icon: Clock },
                { id: 'profile', label: 'Perfil', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'chat') setSelecteddueñoChatId(null);
                    setdueñoTab(tab.id);
                  }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition relative ${
                    dueñoTab === tab.id ? 'text-violet-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-[10px]">{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA DEL PASEADOR (paseador VIEW) */}
        {/* ========================================================================= */}
        {role === 'paseador' && (
          <div className="pawgo-paseador-view">
            <div className="pawgo-paseador-header">
              <div className="flex items-center gap-3">
                <img
                  src={currentWalker?.avatar ?? paseadorS[0].avatar}
                  alt={currentWalker?.name ?? paseadorS[0].name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="font-bold text-sm text-white">{currentWalker?.name ?? paseadorS[0].name}</h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Paseador Verificado • Córdoba ⭐ {currentWalker?.rating ?? paseadorS[0].rating}
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1.5 text-xs font-extrabold transition ${
                  isOnline ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-slate-950 animate-pulse' : 'bg-slate-400'}`}></div>
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>

            {paseadorTab === 'home' && (
              <>
            <div className="pawgo-paseador-stats">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 p-3.5 rounded-2xl shadow space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Ganancias Hoy</span>
                <p className="text-xl font-black">${paseadorEarnings} ARS</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">Paseos en Córdoba</span>
                <p className="text-xl font-black text-violet-900">{currentWalker?.walksDone}</p>
              </div>
            </div>

            <section className="pawgo-reviews">
              <div className="pawgo-reviews-heading">
                <div>
                  <h3 className="pawgo-reviews-title">Reseñas</h3>
                  <p className="pawgo-reviews-caption">Lo que dicen las familias</p>
                </div>
                <div className="pawgo-reviews-score">
                  <Star className="pawgo-reviews-score-icon" />
                  <span className="pawgo-reviews-score-value">{currentWalker?.rating ?? paseadorS[0].rating}</span>
                  <span className="pawgo-reviews-score-total">/ 5</span>
                </div>
              </div>

              <p className="pawgo-reviews-count">
                {walkerReviewCounts[currentWalker?.id ?? paseadorS[0].id] ?? 48} reseñas · Identidad protegida
              </p>

              <div className="pawgo-review-list">
                {currentWalkerReviews.map((review) => (
                  <article key={'walkId' in review ? review.walkId : `mock-${review.id}`} className="pawgo-review">
                    <div className="pawgo-review-heading">
                      <div>
                        <p className="pawgo-review-author">Usuario anónimo</p>
                        <p className="pawgo-review-date">{review.date}</p>
                      </div>
                      <div className="pawgo-review-rating" aria-label={`${review.rating} de 5 estrellas`}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            className={`pawgo-review-star ${index < review.rating ? 'pawgo-review-star-filled' : ''}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="pawgo-review-comment">{review.comment || 'Sin comentario.'}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* INCOMING REQUEST CARD */}
            {walkerActiveWalks.filter((walk) => walk.status === 'requested').map((walk) => (
              <div key={walk.id} className="bg-gradient-to-r from-amber-500 to-orange-500 p-0.5 rounded-3xl shadow-xl animate-pulse">
                <div className="bg-white p-4 rounded-[22px] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                      ¡Nueva Solicitud Entrante!
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">${walk.price} ARS</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{walk.pet.photo}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Mascota: {walk.pet.name}</h4>
                      <p className="text-xs text-slate-500">{walk.pet.breed} • {walk.type}</p>
                      <p className="text-[11px] text-violet-700 font-semibold">Ubicación: Nueva Córdoba (A 200m)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleClearWalk(walk.id)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(walk.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow"
                    >
                      Aceptar Paseo
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* ACTIVE WALK DASHBOARD (paseador) */}
            {walkerActiveWalks.filter((walk) => walk.status === 'in_progress').map((walk) => (
              <div key={walk.id} className="pawgo-paseador-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{walk.pet.photo}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">En paseo con {walk.pet.name}</h3>
                      <p className="text-xs text-slate-500">{walk.type}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                    En Curso
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Enviar actualización al dueño</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddpaseadorReport(walk.id, 'photo')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-violet-600" /> Subir Foto
                    </button>
                    <button
                      onClick={() => handleAddpaseadorReport(walk.id, 'poop')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>💩</span> Reportar Pipi/Pó
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleFinishWalk(walk.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" /> Finalizar Paseo y Cobrar
                </button>
              </div>
            ))}
              </>
            )}

            {paseadorTab === 'chats' && (
              <section className="pawgo-paseador-chat-section">
                {selectedpaseadorChatId === null ? (
                  <>
                    <div className="pawgo-paseador-chat-heading">
                      <div>
                        <h2 className="pawgo-paseador-chat-title">Chats</h2>
                        <p className="pawgo-paseador-chat-subtitle">Conversaciones con las familias</p>
                      </div>
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="pawgo-paseador-chat-list">
                      {visibleConversations.map((chat) => {
                        const lastMessage = chat.messages[chat.messages.length - 1];
                        return (
                          <button
                            key={chat.id}
                            onClick={() => {
                              setSelectedpaseadorChatId(chat.id);
                              setConversations((previous) =>
                                previous.map((conversation) =>
                                  conversation.id === chat.id
                                    ? { ...conversation, paseadorUnread: 0 }
                                    : conversation
                                )
                              );
                            }}
                            className="pawgo-paseador-chat-list-item"
                          >
                            <span className="pawgo-paseador-chat-avatar">{chat.petPhoto}</span>
                            <span className="pawgo-paseador-chat-preview">
                              <span className="pawgo-paseador-chat-preview-top">
                                <span>
                                  <span className="pawgo-paseador-chat-dueño">{chat.dueñoName}</span>
                                  <span className="pawgo-paseador-chat-pet">{chat.petName} · {chat.paseadorName}</span>
                                </span>
                                <span className="pawgo-paseador-chat-time">{chat.time}</span>
                              </span>
                              <span className="pawgo-paseador-chat-last-message">{lastMessage?.text}</span>
                            </span>
                            {chat.paseadorUnread > 0 && (
                              <span className="pawgo-paseador-chat-unread">{chat.paseadorUnread}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : selectedpaseadorChat ? (
                  <div className="pawgo-paseador-chat-window">
                    <div className="pawgo-paseador-chat-conversation-header">
                      <button
                        onClick={() => setSelectedpaseadorChatId(null)}
                        className="pawgo-paseador-chat-back"
                        aria-label="Volver a la lista de chats"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="pawgo-paseador-chat-avatar pawgo-paseador-chat-avatar-small">
                        {selectedpaseadorChat.petPhoto}
                      </span>
                      <div>
                        <h2 className="pawgo-paseador-chat-dueño">{selectedpaseadorChat.dueñoName}</h2>
                        <p className="pawgo-paseador-chat-pet">Tutor de {selectedpaseadorChat.petName}</p>
                      </div>
                    </div>

                    <div className="pawgo-paseador-chat-messages">
                      {selectedpaseadorChat.messages.map((message) => {
                        const ispaseadorMessage = message.sender === 'paseador';
                        return (
                          <div
                            key={message.id}
                            className={`pawgo-paseador-message-row ${
                              ispaseadorMessage ? 'pawgo-paseador-message-row-mine' : ''
                            }`}
                          >
                            <div
                              className={`pawgo-paseador-message ${
                                ispaseadorMessage ? 'pawgo-paseador-message-mine' : 'pawgo-paseador-message-theirs'
                              }`}
                            >
                              <p>{message.text}</p>
                              <span>{message.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form
                      className="pawgo-paseador-chat-compose"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleSendpaseadorChatMessage();
                      }}
                    >
                      <input
                        type="text"
                        value={paseadorChatDraft}
                        onChange={(event) => setpaseadorChatDraft(event.target.value)}
                        placeholder="Escribí un mensaje..."
                        aria-label="Mensaje del chat"
                        className="pawgo-paseador-chat-input"
                      />
                      <button
                        type="submit"
                        disabled={!paseadorChatDraft.trim()}
                        className="pawgo-paseador-chat-send"
                        aria-label="Enviar mensaje"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ) : null}
              </section>
            )}

            <nav className="pawgo-paseador-bottom-nav" aria-label="Navegación del paseador">
              <button
                onClick={() => {
                  setpaseadorTab('home');
                  setSelectedpaseadorChatId(null);
                }}
                className={`pawgo-paseador-nav-button ${paseadorTab === 'home' ? 'pawgo-paseador-nav-button-active' : ''}`}
              >
                <MapPin className="w-5 h-5" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => {
                  setpaseadorTab('chats');
                  setSelectedpaseadorChatId(null);
                }}
                className={`pawgo-paseador-nav-button ${paseadorTab === 'chats' ? 'pawgo-paseador-nav-button-active' : ''}`}
              >
                <span className="pawgo-paseador-nav-icon">
                  <MessageSquare className="w-5 h-5" />
                  {visibleConversations.some((chat) => chat.paseadorUnread > 0) && (
                    <span className="pawgo-paseador-nav-unread" aria-label="Mensajes sin leer" />
                  )}
                </span>
                <span>Chats</span>
              </button>
            </nav>
          </div>
        )}

      </main>
    </div>
  );
}