import type { Locale } from "@/data/guides";

export type FaqTopic = "orders" | "returns" | "payments";

export type FaqItem = {
  id: string;
  topic: FaqTopic;
  question: string;
  answer: string;
};

export type Policy = {
  body: string;
  points: string[];
};

export const policies: Record<
  Locale,
  { shipping: Policy; returns: Policy; warranty: Policy }
> = {
  es: {
    shipping: {
      body: "Enviamos a 15 países con seguimiento y seguro incluido. El envío estándar es gratis a partir de $500.",
      points: [
        "Estándar: 4–7 días hábiles · $19.90",
        "Express: 2–3 días hábiles · $29.90",
        "Seguimiento y seguro en todos los pedidos",
      ],
    },
    returns: {
      body: "Tienes 30 días desde la entrega para devolver un producto sin usar, en su embalaje original.",
      points: [
        "30 días naturales desde la entrega",
        "Producto completo y sin marcas de uso",
        "Reembolso en 5–7 días tras la revisión",
      ],
    },
    warranty: {
      body: "Todos los componentes incluyen 24 meses de garantía frente a defectos de fabricación.",
      points: [
        "Cobertura de 24 meses",
        "RMA gestionado por nuestro equipo",
        "Sustitución sujeta a disponibilidad",
      ],
    },
  },
  en: {
    shipping: {
      body: "We ship to 15 countries with tracking and insurance included. Standard shipping is free from $500.",
      points: [
        "Standard: 4–7 business days · $19.90",
        "Express: 2–3 business days · $29.90",
        "Tracking and insurance on every order",
      ],
    },
    returns: {
      body: "You have 30 days from delivery to return an unused product in its original packaging.",
      points: [
        "30 calendar days from delivery",
        "Complete product with no signs of use",
        "Refund in 5–7 days after inspection",
      ],
    },
    warranty: {
      body: "Every component includes a 24-month warranty against manufacturing defects.",
      points: [
        "24-month coverage",
        "RMA handled by our team",
        "Replacement subject to availability",
      ],
    },
  },
};

export const faq: Record<Locale, FaqItem[]> = {
  es: [
    {
      id: "delivery-time",
      topic: "orders",
      question: "¿Cuánto tarda mi pedido?",
      answer:
        "El envío estándar tarda entre 4 y 7 días hábiles; el express, 2–3. Recibes un número de seguimiento en cuanto el pedido sale del almacén.",
    },
    {
      id: "free-shipping",
      topic: "orders",
      question: "¿El envío es gratis?",
      answer:
        "El envío estándar es gratis a partir de $500. Por debajo, cuesta $19.90. El express tiene un coste fijo de $29.90.",
    },
    {
      id: "change-address",
      topic: "orders",
      question: "¿Puedo cambiar la dirección de envío?",
      answer:
        "Mientras el pedido no haya salido del almacén, sí. Escríbenos con el número de pedido lo antes posible y lo ajustamos.",
    },
    {
      id: "customs",
      topic: "orders",
      question: "¿Hay costes de aduana?",
      answer:
        "Los pedidos internacionales pueden generar aranceles o impuestos locales. No están incluidos en el precio y dependen de la normativa de cada país.",
    },
    {
      id: "return-how",
      topic: "returns",
      question: "¿Cómo devuelvo un producto?",
      answer:
        "Escríbenos dentro de los 30 días posteriores a la entrega con tu número de pedido. Te enviamos las instrucciones y revisamos el producto al recibirlo.",
    },
    {
      id: "return-shipping",
      topic: "returns",
      question: "¿Quién paga el envío de la devolución?",
      answer:
        "Si el motivo es un defecto o un error nuestro, lo cubrimos nosotros. Si es un cambio de opinión, el envío corre por tu cuenta.",
    },
    {
      id: "warranty-damage",
      topic: "returns",
      question: "¿La garantía cubre daños por uso?",
      answer:
        "Cubre defectos de fabricación durante 24 meses. No cubre golpes, líquidos ni overclock fuera de especificación.",
    },
    {
      id: "payment-real",
      topic: "payments",
      question: "¿El pago es real?",
      answer:
        "Esta tienda es una demostración: el checkout simula el pago con una tarjeta de prueba y no realiza ningún cargo.",
    },
    {
      id: "card-data",
      topic: "payments",
      question: "¿Guardan los datos de mi tarjeta?",
      answer:
        "No. El formulario de pago es simulado y no envía datos a ningún servidor ni los almacena.",
    },
  ],
  en: [
    {
      id: "delivery-time",
      topic: "orders",
      question: "How long does my order take?",
      answer:
        "Standard shipping takes 4–7 business days; express takes 2–3. You get a tracking number as soon as the order leaves the warehouse.",
    },
    {
      id: "free-shipping",
      topic: "orders",
      question: "Is shipping free?",
      answer:
        "Standard shipping is free from $500. Below that it costs $19.90. Express has a flat cost of $29.90.",
    },
    {
      id: "change-address",
      topic: "orders",
      question: "Can I change the shipping address?",
      answer:
        "As long as the order hasn't left the warehouse, yes. Write to us with the order number as soon as possible and we'll adjust it.",
    },
    {
      id: "customs",
      topic: "orders",
      question: "Are there customs fees?",
      answer:
        "International orders may incur local duties or taxes. They are not included in the price and depend on each country's rules.",
    },
    {
      id: "return-how",
      topic: "returns",
      question: "How do I return a product?",
      answer:
        "Write to us within 30 days of delivery with your order number. We send instructions and inspect the product when it arrives.",
    },
    {
      id: "return-shipping",
      topic: "returns",
      question: "Who pays return shipping?",
      answer:
        "If the reason is a defect or our mistake, we cover it. If it's a change of mind, return shipping is on you.",
    },
    {
      id: "warranty-damage",
      topic: "returns",
      question: "Does the warranty cover wear and tear?",
      answer:
        "It covers manufacturing defects for 24 months. It does not cover drops, liquid damage or overclocking beyond spec.",
    },
    {
      id: "payment-real",
      topic: "payments",
      question: "Is the payment real?",
      answer:
        "This store is a demo: checkout simulates payment with a test card and never charges anything.",
    },
    {
      id: "card-data",
      topic: "payments",
      question: "Do you store my card details?",
      answer:
        "No. The payment form is simulated and never sends or stores data on a server.",
    },
  ],
};

export const faqTopics: FaqTopic[] = ["orders", "returns", "payments"];
