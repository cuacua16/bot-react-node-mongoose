import moment from 'moment'
export class ChatBotLogic {
  constructor(config) {
    // Object.assign(this, config)
    this.chats = config.chats || [];
    this.delayResponse = config.delayResponse || 0;
    this.timeOpen = config.timeOpen || 8;
    this.timeClose = config.timeClose || 24;
    this.sound = config.sound;
    this.navigate = config.navigate || (() => {});
    this.messages = config.messages || [];
    this.setMessages = config.setMessages || (() => {});
    this.cart = config.cart || {};
    this.setBotEvent = config.setBotEvent || (() => {});
  }
  
  initChatBot() {
    this.updateChats();
    this.root = this.chats.find(c => c.root);
    this.fallback = this.chats.find(c => c.fallback);
    this.cart_updated = this.chats.find(c => c.cart_updated)
    this.currentNode = this.root;
    this.messages = [{ sender: 'bot', ...this.root }];
    this.setMessages([...this.messages]);
  }
  
  update(cart) {
    this.cart = cart;
    this.updateChats();
  }

  updateChats() {
    this.chats.forEach(chat => {
      const dynamicOptions = chat.dynamicOptions && chat.dynamicOptions(this) || [];
      chat.options = this.chats.filter(c => {
        return (
          c.parents && c.parents.includes(chat.id) &&
          (!c.conditionActive || c.conditionActive(this))
        )
      }).concat(dynamicOptions);
    });
  }

  async botMessage(message, delay=true) {
    if (delay) {
      this.playAudio("typing");
      this.addMessage({bot_text: "...", sender: 'bot'});
      await this.delay();
      this.messages = this.messages.filter(m => m.bot_text !== '...');
      this.stopAudio();
    }
    const bot_text = typeof message.bot_text === 'function' ? message.bot_text(this) : message.bot_text;
    this.addMessage({...message, sender: 'bot', bot_text})
  }
  
  userMessage(input) {
    this.input = input;
    this.addMessage({sender: 'user', bot_text: input})
  }
  
  addMessage(message) {
    this.messages.forEach(m => (m.disabled = true));
    this.messages.push(message);
    this.setMessages([...this.messages]);
  }
  
  async notifyCartChange(){
    this.updateChats()
    this.currentNode = this.cart_updated;
    await this.botMessage(this.currentNode, false)
    this.playAudio("yay")
  }
  
  async addProduct(){
    await this.botMessage({bot_text: `😛 ${this.input} unidades de ${this.productSelected.name} añadidas, con un costo de $${this.productSelected.price * parseInt(this.input)}`})
    this.setBotEvent({action: "addToCart", payload: [this.productSelected, parseInt(this.input)]});
  }
  
  inputQuantity(){
    const { valid } = this.validateNode({
      validate: (chatbot) => !isNaN(chatbot.input) && parseInt(chatbot.input) >= 1,
      validate_error: (chatbot) => chatbot.botMessage({bot_text: `Ups! 😵 ${chatbot.input} no es un número válido. Intenta nuevamente.`})
    })
    if (valid) this.addProduct();
  }
  
  selectProduct(){
    this.productSelected = this.products.find(p => this.normalizeText(p.name) == this.normalizeText(this.input));
    if (!this.productSelected) return this.errorMessage();
    this.currentNode = {
      actionFinish: (chatbot) => chatbot.inputQuantity(),
      bot_text: `¡Excelente elección! ¿Cuántas unidades de ${this.productSelected.name} quieres pedir?`,
    }
    this.botMessage(this.currentNode)
  }
  
  validateNode(node){
    let r = { valid: true, retry: false};
    if (node?.validate && !node.validate(this)) {
      r.valid = false;
      if (node.validate_error && node.validate_error(this)) r.retry = true;
    }
    return r;
  }

  async userInput(input) {
    if (!input.trim()) return;
    this.userMessage(input)

    let nextNode = (
      this.chats.find(chat => this.normalizeText(chat.user_input) === this.normalizeText(input)) || 
      this.chats.find(chat => chat.matches && chat.matches.some(match => this.normalizeText(match) === this.normalizeText(input)))
    );
    
    if (this.currentNode.actionFinish) return this.currentNode.actionFinish(this);
    
    if (!nextNode) {
      return this.errorMessage()
    }
    
    const {valid, retry} = this.validateNode(nextNode);
    if (!valid) {
      if (!retry) await this.fallbackMessage();
      return;
    }

    if (nextNode.action) this.nodeAction(nextNode);
    
    this.currentNode = nextNode;
    await this.botMessage(nextNode);
    this.playAudio("success")
    
    if (!this.currentNode?.options?.length) await this.fallbackMessage();
  }
  
  async errorMessage(){
    await this.botMessage({ bot_text: "Lo siento, no puedo entender tu mensaje." });
    this.playAudio("error");
    this.fallbackMessage();
  }
  
  async fallbackMessage(node){
    await this.botMessage(this.fallback);
    this.currentNode = node || this.root;
  }
    
  normalizeText(text) {
    return !text ? "" : text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').toLowerCase();
  }
  
  nodeAction(node) {
    try {
      node.action(this)
    } catch (error) {
      console.log(error)
    }
  }

  stopAudio(){
    if (this.playing) this.playing.pause();
  }
  
  playAudio(audio) {
    if (this.sound) {
      this.playing = new Audio(`/audio/${audio}.mp3`)
      this.playing.play()
    }
  }
  
  async delay(){
    await new Promise(resolve => setTimeout(resolve, this.delayResponse));
  }
  
  isOpen() {
    return moment().hour() >= this.timeOpen && moment().hour() <= this.timeClose;
  }

  getMessages() {
    return [...this.messages];
  }

  getCurrentNode() {
    return this.currentNode;
  }
}
