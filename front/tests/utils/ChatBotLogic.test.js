import { ChatBotLogic } from '@/utils/ChatBotLogic';
import { chats } from '@/utils/chats';
import moment from 'moment';

jest.mock('moment', () => {
  return jest.fn().mockReturnValue({
    hour: jest.fn().mockReturnValue(10),
  });
});

describe('ChatBotLogic', () => {
  let chatbot;

  beforeEach(() => {
    chatbot = new ChatBotLogic({
      chats,
      delayResponse: 1000,
      timeOpen: 8,
      timeClose: 24,
      sound: false,
      navigate: jest.fn(),
      setMessages: jest.fn(),
      cart: { items: [], price: 0 },
      setBotEvent: jest.fn(),
    });
    chatbot.initChatBot()
  });

  it('should initialize the chatbot with correct properties', () => {
    expect(chatbot.currentNode).toBeDefined();
    expect(chatbot.currentNode.options).toBeDefined();
    expect(chatbot.messages).toBeDefined();
  });

  it('should update the chats correctly', () => {
    const spyUpdate = jest.spyOn(chatbot, 'updateChats');
    const cart = { items: [{ name: 'Product 1', quantity: 2 }] };
    chatbot.update(cart);
    expect(chatbot.cart).toEqual(cart);
    expect(spyUpdate).toHaveBeenCalled();
    expect(chatbot.chats).toHaveLength(chats.length);
  });
  
  it('should notify cart change correctly', async () => {
    const spyBotMessage = jest.spyOn(chatbot, 'botMessage');
    await chatbot.notifyCartChange();
    expect(spyBotMessage).toHaveBeenCalled();
    expect(chatbot.currentNode).toEqual(chatbot.cart_updated);
  });
  
  it('should handle bot messages correctly', async () => {
    const bot_text = "Hola";
    await chatbot.botMessage({ bot_text });
    expect(chatbot.setMessages).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ sender: 'bot', bot_text })
    ]));
  });

  it('should handle user messages correctly', async () => {
    chatbot.userInput('x');
    if (chatbot.delayResponse) {
      expect(chatbot.messages[chatbot.messages.length-1]).toEqual({ sender: 'bot', bot_text: '...' });
    }
  });
  
  
  it('should handle bot message with delay', async () => {
    const spyDelay = jest.spyOn(chatbot, 'delay');
    chatbot.botMessage({ bot_text: 'Test message' });
    expect(spyDelay).toHaveBeenCalled();
  });

  it('should check if the chatbot is open based on the current time', () => {
    moment.mockReturnValueOnce({ hour: jest.fn().mockReturnValue(12) });
    expect(chatbot.isOpen()).toBe(true);
    moment.mockReturnValueOnce({ hour: jest.fn().mockReturnValue(2) });
    expect(chatbot.isOpen()).toBe(false);
  });

  it('should handle error messages when invalid input is given', async () => {
    const spyFallback = jest.spyOn(chatbot, 'errorMessage');
    chatbot.userInput('Invalid input');
    expect(spyFallback).toHaveBeenCalled();
  });
  
  it('should perform node actions correctly', () => {
    const mockAction = jest.fn();
    const node = { action: mockAction };
    chatbot.nodeAction(node);
    expect(mockAction).toHaveBeenCalled();
  });

  it('should validate node correctly', () => {
    expect(chatbot.validateNode({ validate: () => true }).valid).toBe(true);
    expect(chatbot.validateNode({ validate: () => false }).valid).toBe(false);
  });
  
  it('should validate product quantity correctly', () => {
    const spyAddProduct = jest.spyOn(chatbot, 'addProduct')
    chatbot.productSelected = {};
    chatbot.input = '3';
    chatbot.inputQuantity();
    expect(spyAddProduct).toHaveBeenCalled();
  });
  
  it('should normalize text correctly', () => {
    const normalizedText = chatbot.normalizeText('Ñandús');
    expect(normalizedText).toBe('nandus');
  });
  
  
  
});
