export class ChatBotLogic {
  constructor(config) {
    console.log("constructor")
    this.chats = config.chats;
    this.delayResponse = config.delayResponse;
    this.onUpdateMessages = config.onUpdateMessages || (() => {});
    this.buildChatBot();
    this.root = this.chats.find(c => c.root);
    this.currentNode = this.root;
    this.messages = [{ sender: 'bot', ...this.root }];
    this.onUpdateMessages([...this.messages]);
    this.actions = config.actions || {};
    this.sound = config.sound;
  }

  buildChatBot() {
    this.chats.forEach(chat => {
      chat.options = this.chats.filter(c => c.id_parent === chat.id);
    });
  }

  resetChat() {
    this.messages = [{ sender: 'bot', ...this.root }];
    this.currentNode = this.root;
    this.onUpdateMessages([...this.messages]);
    return this.messages;
  }

  addMessage(message) {
    this.messages.forEach(m => (m.disabled = true));
    this.messages.push(message);
    this.onUpdateMessages([...this.messages]);
    return [...this.messages];
  }
  
  normalizeText(text) {
    return !text ? "" : text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').toLowerCase();
  }
  
  nodeAction(node) {
    try {
      node.action(this.actions)
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

  async userInput(input, navigate) {
    if (!input.trim()) return;
    
    this.playAudio("typing")

    const userMessage = { sender: 'user', bot_text: input };
    this.addMessage(userMessage);

    const typingMessage = { sender: 'bot', bot_text: '...' };
    this.addMessage(typingMessage);
    
    let nextNode = this.chats.find((chat) => chat.matches && chat.matches.some((match) => this.normalizeText(match) === this.normalizeText(input)));

    if (!nextNode) nextNode = this.chats.find(chat => this.normalizeText(chat.user_input) === this.normalizeText(input));

    await new Promise(resolve => setTimeout(resolve, this.delayResponse));
    
    this.messages = this.messages.filter(m => m.bot_text !== '...');
    
    if (this.currentNode.validate && !this.currentNode.validate(input)) {
      return this.currentNode.validate_bot_text ? this.addMessage({ sender: 'bot', bot_text: this.currentNode.validate_bot_text(input)}) : "";
    }
    
    if (this.currentNode.bot_text_post) {
      this.addMessage({ sender: 'bot', bot_text: this.currentNode.bot_text_post(input)});
    }

    this.stopAudio();
    if (nextNode) {
      if (nextNode.action) this.nodeAction(nextNode);
      if (typeof nextNode.bot_text == 'function') nextNode.bot_text = nextNode.bot_text(input);
      this.currentNode = nextNode;
      this.addMessage({ sender: 'bot', ...nextNode});
      this.playAudio("success")
    } else {
      if (this.currentNode.type === 'input') {
        this.addMessage({
          sender: 'bot',
          bot_text: 'Gracias por tu información.',
        });
        this.playAudio("success2")
      } else {
        this.addMessage({
          sender: 'bot',
          bot_text: "Lo siento, no puedo entender tu mensaje. ¿En qué puedo ayudarte?",
        });
        this.playAudio("error")
      }
      this.currentNode = this.root;
    }
  }

  getMessages() {
    return [...this.messages];
  }

  getCurrentNode() {
    return this.currentNode;
  }
}
