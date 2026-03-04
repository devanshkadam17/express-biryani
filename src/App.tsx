/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'chicken-biryani',
    name: 'Chicken Dum Biryani',
    price: 200,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop',
    description: 'Authentic Hyderabadi style chicken dum biryani with aromatic spices.'
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    price: 280,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=1000&auto=format&fit=crop',
    description: 'Tender mutton cooked with long-grain basmati rice and secret spices.'
  },
  {
    id: 'shawarma',
    name: 'Shawarma',
    price: 120,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=1000&auto=format&fit=crop',
    description: 'Grilled chicken wrapped in soft pita bread with garlic sauce and veggies.'
  },
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    price: 150,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
    description: 'Fresh seasonal vegetables cooked with fragrant basmati rice.'
  }
];

const WHATSAPP_NUMBER = '918353835339';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    MENU_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('express_biryani_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('express_biryani_cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
    // Reset quantity selector after adding
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Hi Express Biryani,\n\nI want to order:\n\n`;
    cart.forEach(item => {
      message += `- ${item.name} x${item.quantity} – ₹${item.price * item.quantity}\n`;
    });
    message += `\nTotal: ₹${totalAmount}\n\nName:\nAddress:\nPhone:`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#FFC107]/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-xl italic">EB</span>
            </div>
            <h1 className="text-xl font-black italic tracking-tighter text-[#FFC107]">EXPRESS BIRYANI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#menu" className="hover:text-[#FFC107] transition-colors">Menu</a>
            <a href="#about" className="hover:text-[#FFC107] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#FFC107] transition-colors">Contact</a>
          </nav>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#FFC107] hover:bg-[#FFC107]/10 rounded-full transition-colors"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2000&auto=format&fit=crop" 
            alt="Biryani Hero" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-[#FFC107] text-black text-xs font-black uppercase tracking-[0.2em] mb-6 rounded-full">
              Pulivendula's Best Biryani
            </span>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-6">
              TASTE THE <br />
              <span className="text-[#FFC107]">AUTHENTIC</span> FLAVOR
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto mb-10">
              Experience the legendary spices and perfectly cooked grains that make Express Biryani the favorite spot in Pulivendula.
            </p>
            <a 
              href="#menu" 
              className="inline-flex items-center gap-3 bg-[#FFC107] text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Order Now <Plus size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h3 className="text-4xl font-black italic tracking-tighter mb-2">OUR SIGNATURE MENU</h3>
            <p className="text-zinc-500 font-medium">Freshly prepared, served with love.</p>
          </div>
          <div className="h-px flex-grow bg-[#FFC107]/20 mx-8 hidden md:block mb-4"></div>
          <div className="flex gap-4">
            <span className="px-4 py-2 border border-[#FFC107] text-[#FFC107] rounded-full text-xs font-bold uppercase tracking-widest">All Items</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MENU_ITEMS.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-[#FFC107]/50 transition-all hover:shadow-2xl hover:shadow-[#FFC107]/10"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#FFC107]/30">
                  <span className="text-[#FFC107] font-black italic">₹{item.price}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black italic mb-2">{item.name}</h4>
                <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-black/40 rounded-2xl p-2 border border-zinc-800">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#FFC107] transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-black text-lg w-8 text-center">{quantities[item.id] || 1}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#FFC107] transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-[#FFC107] text-black py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FFC107]/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section id="about" className="bg-[#FFC107] text-black py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black text-[#FFC107] rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <MapPin size={32} />
            </div>
            <h5 className="text-2xl font-black italic mb-4">LOCATION</h5>
            <p className="font-bold uppercase tracking-tight opacity-80">
              Main Road, Pulivendula,<br />
              Andhra Pradesh 516390
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black text-[#FFC107] rounded-2xl flex items-center justify-center mb-6 -rotate-3">
              <Clock size={32} />
            </div>
            <h5 className="text-2xl font-black italic mb-4">OPENING HOURS</h5>
            <p className="font-bold uppercase tracking-tight opacity-80">
              Mon - Sun: 11:00 AM - 11:00 PM<br />
              Open All Days
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black text-[#FFC107] rounded-2xl flex items-center justify-center mb-6 rotate-6">
              <Phone size={32} />
            </div>
            <h5 className="text-2xl font-black italic mb-4">CONTACT</h5>
            <p className="font-bold uppercase tracking-tight opacity-80">
              +91 83538 35339<br />
              expressbiryani.pvl@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-zinc-950 border-t border-zinc-900 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-[#FFC107] rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-2xl italic">EB</span>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-[#FFC107]">EXPRESS BIRYANI</h1>
              </div>
              <p className="text-zinc-500 max-w-md mb-8">
                Bringing the authentic taste of tradition to Pulivendula. Our biryanis are crafted with passion and the finest ingredients.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#FFC107] transition-colors border border-zinc-800">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#FFC107] transition-colors border border-zinc-800">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-[#FFC107] transition-colors border border-zinc-800">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            <div>
              <h6 className="text-white font-black italic mb-8 tracking-widest uppercase text-sm">Quick Links</h6>
              <ul className="space-y-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                <li><a href="#menu" className="hover:text-[#FFC107] transition-colors">Menu</a></li>
                <li><a href="#about" className="hover:text-[#FFC107] transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-[#FFC107] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#FFC107] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h6 className="text-white font-black italic mb-8 tracking-widest uppercase text-sm">Newsletter</h6>
              <p className="text-zinc-500 text-sm mb-6">Get updates on special offers and new menu items.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFC107] w-full"
                />
                <button className="bg-[#FFC107] text-black px-4 py-3 rounded-xl font-black uppercase text-xs">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-900 pt-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; 2024 EXPRESS BIRYANI PULIVENDULA. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* Sticky View Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="pointer-events-auto bg-white text-black px-8 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform"
            >
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-[#FFC107] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              </div>
              View Cart – ₹{totalAmount}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Icon */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-950 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
                <h2 className="text-3xl font-black italic tracking-tighter">YOUR CART</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <Minus size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-700">
                      <ShoppingCart size={48} />
                    </div>
                    <h3 className="text-xl font-black italic mb-2">CART IS EMPTY</h3>
                    <p className="text-zinc-500 mb-8">Looks like you haven't added anything yet.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-[#FFC107] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest"
                    >
                      Start Ordering
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black italic text-lg">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-zinc-900 rounded-xl px-3 py-1 border border-zinc-800">
                            <button onClick={() => updateCartItemQuantity(item.id, -1)} className="text-zinc-500 hover:text-white"><Minus size={14} /></button>
                            <span className="font-black text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartItemQuantity(item.id, 1)} className="text-zinc-500 hover:text-white"><Plus size={14} /></button>
                          </div>
                          <span className="font-black italic text-[#FFC107]">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-zinc-900/50 border-t border-zinc-900 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Grand Total</span>
                    <span className="text-4xl font-black italic text-[#FFC107]">₹{totalAmount}</span>
                  </div>
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#25D366]/90 transition-colors shadow-xl"
                  >
                    Order on WhatsApp <MessageCircle size={24} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
