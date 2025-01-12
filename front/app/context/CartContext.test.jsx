import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';

jest.mock('@/services/api', () => ({
  orders: {
    create: jest.fn().mockResolvedValue({ ok: true }),
  },
}));

const TestComponent = () => {
  const { cart, addToCart, removeFromCart, clearCart, completeOrder } = useCart();

  return (
    <div>
      <p data-testid="cart-items">{cart.items.reduce((acc, p) => acc + p.quantity, 0)}</p>
      <p data-testid="cart-price">{cart.price}</p>
      <button onClick={() => addToCart({ _id: '1', price: 10 }, 1)}>Add</button>
      <button onClick={() => removeFromCart('1')}>Remove</button>
      <button onClick={clearCart}>Clear</button>
      <button onClick={completeOrder}>Complete Order</button>
    </div>
  );
};

const renderWithProvider = () => render(<CartProvider><TestComponent /></CartProvider>);
const clickButton = (type) => { act(() => { screen.getByText(type).click() }) };
const asyncClickButton = async (type) => { await act(async () => { screen.getByText(type).click() }) };
const getValueCart = (type) => screen.getByTestId(type).textContent;

describe('CartContext', () => {
  beforeEach(() => {
    cleanup();
    renderWithProvider();
  });

  it('should initialize with an empty cart', () => {
    expect(getValueCart("cart-items")).toBe('0');
    expect(getValueCart("cart-price")).toBe('0');
  });

  it('should add items to the cart', async () => {
    clickButton("Add");
    clickButton("Add");
    clickButton("Add");
    expect(getValueCart("cart-items")).toBe('3');
    expect(getValueCart("cart-price")).toBe('30');
  });

  it('should remove items from the cart', () => {
    clickButton("Add")
    clickButton("Remove")
    expect(getValueCart("cart-items")).toBe('0');
    expect(getValueCart("cart-price")).toBe('0');
  });

  it('should clear the cart', () => {
    clickButton("Add")
    clickButton("Clear")
    expect(getValueCart("cart-items")).toBe('0');
    expect(getValueCart("cart-price")).toBe('0');
  });

  it('should complete the order and clear the cart', async () => {
    clickButton("Add")
    await asyncClickButton("Complete Order")
    expect(getValueCart("cart-items")).toBe('0');
    expect(getValueCart("cart-price")).toBe('0');
  });
});
