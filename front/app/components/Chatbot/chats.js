export const chats = [
  {
    id: "9264asdk",
    bot_text: "¡Hola! ¿En qué puedo ayudarte?",
    root: true,
    matches: ["hola", "oye", "buenas tardes", "que tal"]
  },

  {
    id: "ds8a9d",
    user_input: "Quiero realizar un pedido.",
    id_parent: "9264asdk",
    bot_text: (data) => "¡Genial! ¿Qué tipo de sushi te gustaría pedir? 🍣",
    type: "select",
    action: () => {},
    conditionActive: () => true,
    matches: ["pedido", "hacer pedido"],
  },

  {
    id: "ds8a0hd0s",
    user_input: "Quiero sushi.",
    id_parent: "ds8a9d",
    bot_text: (data) => "Perfecto, ¿qué tipo de sushi prefieres? Tenemos rollos, nigiri, sashimi, entre otros.",
    type: "select",
    action: () => {},
    conditionActive: () => true,
    matches: ["quiero sushi", "dame sushi", "quiero pedir sushi"],
  },

  {
    id: "sushiType",
    user_input: "Rollos",
    id_parent: "ds8a0hd0s",
    bot_text: (data) => "¡Excelente elección! ¿Cuántos rollos de sushi te gustaría pedir?",
    bot_text_post: (input) => `Excelente! ${input} rollos es buen número`,
    type: "input",
    action: (data) => { },
    validate: (input) => !isNaN(input),
    validate_bot_text: (input) => `Ups! 😵 ${input} no es un número válido de rollos. Intenta nuevamente`,
    matches: ["rollos", "sushi rollo", "rollo"],
  },

  {
    id: "addMore",
    user_input: "Sí, quiero añadir una bebida.",
    id_parent: "orderQuantity",
    bot_text: (data) => "¡Muy bien! ¿Qué bebida te gustaría añadir al pedido? 🍹",
    type: "select",
    action: () => {},
    matches: ["bebida", "beber"],
  },

  {
    id: "drinkSelection",
    user_input: "Agua",
    id_parent: "addMore",
    bot_text: (data) => "Has elegido agua. ¿Cuántas botellas te gustaría?",
    type: "input",
    action: () => {},
  },

  {
    id: "drinkQuantity",
    user_input: "2 botellas",
    id_parent: "drinkSelection",
    bot_text: (data) => "Perfecto, has añadido 2 botellas de agua a tu pedido. ¿Te gustaría añadir algo más?",
    type: "input",
    action: () => {},
  },

  {
    id: "finalizeOrder",
    user_input: "No, está bien así.",
    id_parent: "drinkQuantity",
    bot_text: (data) => "Entendido. Resumen de tu pedido: 3 rollos de sushi y 2 botellas de agua. ¿Quieres confirmar el pedido?",
    type: "select",
    action: () => {},
    matches: ["confirmar", "sí", "aceptar", "confirmar pedido"],
  },

  {
    id: "confirmOrder",
    user_input: "Sí, confirmar.",
    id_parent: "finalizeOrder",
    bot_text: (data) => "¡Tu pedido ha sido confirmado! Te enviaremos un resumen por correo y comenzaremos a prepararlo. 🎉",
    type: "message",
    action: () => {},
  },

  {
    id: "viewMenu",
    user_input: "Quiero ver el menú.",
    id_parent: "9264asdk",
    bot_text: (data) => "Perfecto, puedes ver el menú en nuestra página de productos.",
    action: (actions) => { actions.navigate("/products") },
    matches: ["ver menú", "mostrar menú", "productos", "sushi"],
  },

  {
    id: "bye",
    user_input: "Adiós.",
    bot_text: (data) => "Gracias por contactarnos. ¡Hasta luego! 🍣",
    type: "message",
    matches: ["adios", "chao", "hasta luego"],
  },
];
