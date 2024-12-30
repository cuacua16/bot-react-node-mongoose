export const chats = [
  {
    id: "9264asdk",
    text: "¡Hola! ¿En qué puedo ayudarte?",
    root: true,
  },
  
  {
    id: "ds8a9d",
    answer: "Quiero realizar un pedido.",
    id_parent: "9264asdk",
    text: "¿Qué tipo de pedido quieres realizar?",
    type: "select",
    action: () => {},
    conditionActive: () => true,
  },
  {
    id: "ds8a0hd0s",
    answer: "Quiero sushi.",
    id_parent: "ds8a9d",
    text: "Perfecto, por favor ingresa tu número de telefono para continuar con el pedido",
    type: "input",
    action: () => {},
    conditionActive: () => true,
  },
  
  {
    id: "9d0us9ja",
    answer: "Quiero ver el menú.",
    id_parent: "9264asdk",
    action: () => {},
    conditionActive: () => true,
  },
]