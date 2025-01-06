export const chats = [
  {
    id: "root",
    bot_text: "¡Hola! ¿En qué puedo ayudarte?",
    root: true,
    matches: ["hola", "oye", "buenas tardes", "que tal"]
  },
  
  {
    id: "root",
    fallback: true,
    bot_text: "¿Puedo ayudarte en algo más?",
    matches: []
  },
  
  {
    id: "faq",
    user_input: "Ver preguntas frecuentes",
    parents: ["root"],
    bot_text: "Aquí tienes un listado de preguntas frecuentes. ¿Sobre qué tema necesitas ayuda?",
    matches: ["una pregunta", "preguntas", "preguntas frecuentes"],
  },
  
  {
    id: "faq_order",
    user_input: "¿Cómo hago un pedido?",
    parents: ["faq"],
    bot_text: "¡Yo puedo ayudarte a hacer un pedido! ¿Quieres realizar uno ahora?",
    matches: ["como hago pedido", "como pido", "quiero pedir algo"],
  },
  
  {
    id: "faq_time",
    user_input: "¿Están abiertos?",
    parents: ["faq"],
    bot_text: (chatbot) => {
      if (chatbot.isOpen()) return `¡Sí! estaremos hasta las ${chatbot.timeClose} horas.`;
      return `No, estaremos abiertos desde las ${chatbot.timeOpen} hasta las ${chatbot.timeClose} horas, pero igual podríamos reservar un pedido ahora.`
    },
    matches: ["esta abierto", "abierto ahora"],
  },
  
  {
    id: "faq_delivery",
    user_input: "¿Hacen envíos a domicilio?",
    parents: ["faq"],
    bot_text: (chatbot) => `¡Sí! hacemos envíos dentro de nuestro horario de atención (${chatbot.timeOpen} a ${chatbot.timeClose} horas)`,
    matches: ["hacen envios"],
  },
  
  {
    id: "faq_cancel_order",
    user_input: "¿Puedo cancelar un pedido después de confirmarlo?",
    parents: ["faq"],
    bot_text: `¡Sí! puedes cancelar pedidos que todavía no fueron entregados. Puedes hacerlo en la sección "Mis pedidos" en el menú de la izquierda 👈`,
    matches: ["anular pedido"],
  },
  
  {
    id: "view_menu",
    user_input: "Quiero ver el menú.",
    parents: ["root", "order", "input_quantity"],
    bot_text: "Perfecto, ya puedes ver el menú en nuestra página de productos 👈",
    action: (chatbot) => { chatbot.navigate("/products") },
    matches: ["ver menú", "mostrar menú", "ver los productos", "ver productos"],
  },
  
  {
    id: "order",
    user_input: "Quiero realizar un pedido.",
    conditionActive: (chatbot) => !chatbot.cart.items.length,
    parents: ["root", "view_cart", "faq_order", "input_quantity"],
    bot_text: "¡Genial! ¿Ya sabes qué vas a pedir o prefieres que te ayude a elegir algo?",
    matches: ["pedido", "hacer pedido", "quiero hacer un pedido", "realizar un pedido", "realizar pedido"],
  },
  
  {
    id: "order",
    user_input: "Quiero agregar productos a mi carrito",
    conditionActive: (chatbot) => !!chatbot.cart.items.length,
    parents: ["root", "view_cart", "faq_order", "input_quantity", "cart_updated"],
    bot_text: "¡Genial! ¿Qué quieres agregar?",
    matches: ["agregar a mi carrito", "agregar producto"],
  },
  
  {
    id: "view_cart",
    user_input: "Ver mi carrito.",
    parents: ["root", "input_quantity", "cart_updated"],
    bot_text: (chatbot) => {
      if (chatbot.cart.items.length === 0) {
        return "Tu carrito está vacío. ¿Te gustaría agregar algo?";
      }
      return `Tu carrito actual contiene: ${chatbot.cart.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}. ¿Quieres agregar algo más?`;
    },
    matches: ["mi carrito", "ver carrito", "ver mi carrito"],
  },
  
  {
    id: "cart_updated",
    cart_updated: true,
    bot_text: (chatbot) => {
      const quantityProducts = chatbot.cart.items.reduce((acc, p) => acc + p.quantity, 0);
      return `¡Tu carrito se ha actualizado! ahora tienes ${quantityProducts} producto${quantityProducts > 1 ? 's' : ''}, con un costo total de $${chatbot.cart.price}`
    },
    matches: [],
  },
  
  {
    id: "sushi",
    user_input: "Quiero Sushi",
    parents: ["order"],
    dynamicOptions: (chatbot) => chatbot.products?.filter(p => p.type == 'sushi').map(p => ({user_input: p.name})),
    actionFinish: (chatbot) => chatbot.selectProduct(),
    bot_text: `¿Quieres sushi 🍣? En este momento puedes elegir entre las siguientes opciones disponibles:`,
    validate: (chatbot) => chatbot.products.find(p => p.type == 'sushi'),
    validate_error: (chatbot) => {
      chatbot.botMessage({bot_text: "Lo siento, no tenemos sushi en este momento"})
      return false;
    },
    matches: ["quiero sushi", "quiero pedir sushi", "dame sushi"],
  },
  
  {
    id: "drink",
    user_input: "Quiero algo de beber",
    parents: ["order"],
    dynamicOptions: (chatbot) => chatbot.products?.filter(p => p.type == 'drink').map(p => ({user_input: p.name})),
    actionFinish: (chatbot) => chatbot.selectProduct(),
    bot_text: `¿Quieres algo para beber 🍾? En este momento puedes elegir entre las siguientes opciones disponibles:`,
    validate: (chatbot) => chatbot.products.find(p => p.type == 'drink'),
    validate_error: (chatbot) => {
      chatbot.botMessage({bot_text: "Lo siento, no tenemos bebidas en este momento"})
      return false; 
    },
    matches: ["para beber", "agregar bebida", "quiero bebida"],
  },
  
  {
    id: "complete_order",
    user_input: "Confirmar compra",
    bg: "bg-green-500",
    action: async (chatbot) => {
      chatbot.completedOrder = {...chatbot.cart};
      chatbot.setBotEvent({action: "completeOrder"});
    },
    conditionActive: (chatbot) => !!chatbot.cart.items.length,
    parents: ["view_cart", "cart_updated"],
    bot_text: (chatbot) => `Se ha confirmado el pedido: ${chatbot.completedOrder.items.map(item => `${item.quantity}x ${item.product.name}`).join(", ")}. El precio total es de $${chatbot.completedOrder.price}. Lo entregaremos ${chatbot.isOpen() ? 'en 30 minutos.' : `a las ${chatbot.timeOpen}:00.`}`,
    matches: ["confirmar pedido", "comfirmar compra"],
  },
  
  {
    id: "cancel_order",
    user_input: "Cancelar pedido (limpiar carrito)",
    bg: "bg-red-500",
    conditionActive: (chatbot) => !!chatbot.cart.items.length,
    action: (chatbot) => chatbot.setBotEvent({ action: "clearCart"}),
    parents: ["view_cart", "cart_updated"],
    bot_text: (chatbot) => `Se ha limpiado el carrito.`,
    matches: ["limpiar carrito"],
  },

];
