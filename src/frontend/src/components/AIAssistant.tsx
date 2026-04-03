import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: Date;
}

function getBotReply(input: string): string {
  const msg = input.toLowerCase();

  if (/\b(hi|hello|hey|howdy|greetings|sup)\b/.test(msg)) {
    return "Hey there! 👋 I'm FitHub AI, your personal fitness guide. I can help you find workouts, discover coaches, explore sessions, and more. What are you looking to achieve today?";
  }
  if (/\b(workout|exercise|training|train)\b/.test(msg)) {
    return "Great question! FitHub has an amazing range of sessions — HIIT for intensity, Yoga for flexibility, Strength for muscle building, and Cardio for endurance. 🔥 Head to the Sessions page to explore and filter by category!";
  }
  if (/\b(coach|trainer|instructor)\b/.test(msg)) {
    return "Our coaches are world-class! 🏆 Visit the Coaches page to browse profiles, read reviews, and filter by specialty. Each coach offers personalized programs tailored to your goals.";
  }
  if (/\b(beginner|start|new|first time|newbie|starting)\b/.test(msg)) {
    return "Welcome to your fitness journey! 🌟 If you're just starting out, I'd recommend trying a Yoga or Cardio session — they're beginner-friendly and build a solid foundation. You can also connect with a coach for a personalized plan!";
  }
  if (/\b(lose weight|fat|cardio|burn|slim|weight loss)\b/.test(msg)) {
    return "For fat loss, Cardio and HIIT sessions are your best friends! 🏃‍♀️ Consistency is key — aim for 3-4 sessions per week. Browse our Cardio and HIIT categories on the Sessions page and pair with a coach for best results.";
  }
  if (/\b(muscle|strength|bulk|lift|strong|gains)\b/.test(msg)) {
    return "Building muscle? Let's go! 💪 Check out our Strength training sessions — progressive overload is the secret sauce. Start with compound lifts and gradually increase weight each week. Our strength coaches can design a custom program for you!";
  }
  if (/\b(yoga|meditation|flexibility|mindful|calm|relax|stress)\b/.test(msg)) {
    return "Yoga and meditation are incredibly powerful for both body and mind. 🧘 We have sessions for all levels — from gentle flow to power yoga. Mindfulness practice can also accelerate your physical training by improving focus and recovery.";
  }
  if (/\b(nutrition|diet|food|eat|meal|protein|calories)\b/.test(msg)) {
    return "FitHub specializes in training and coaching! 🥗 While we don't have a dedicated nutrition tracker, many of our coaches offer nutrition guidance as part of their coaching packages. Connect with a coach and ask about nutrition advice!";
  }
  if (/\b(price|cost|free|pay|subscription|money|cheap|afford)\b/.test(msg)) {
    return "Great news — most FitHub sessions are free to enroll! 🎉 Simply sign in, browse sessions, and hit Enroll. Premium coaching packages are available for personalized 1-on-1 programs. Check individual coach profiles for pricing.";
  }
  if (/\b(live|virtual|online|zoom|stream|real.?time)\b/.test(msg)) {
    return "FitHub offers both live virtual sessions and pre-recorded programs! 📡 Live sessions let you train in real-time with a coach (great for accountability), while pre-recorded ones let you work out on your own schedule. Filter by 'Live' on the Sessions page!";
  }
  if (/\b(thank|thanks|great|awesome|perfect|nice|love)\b/.test(msg)) {
    return "You're welcome! 😊 Feel free to ask me anything else about workouts, coaches, or sessions. I'm here to help you crush your fitness goals!";
  }

  return "Hmm, I'm not quite sure about that! 🤔 But don't worry — you can browse our **Coaches** page to find expert guidance, or explore **Sessions** to discover the perfect workout. Is there something specific about fitness I can help with?";
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Hi! I'm your FitHub AI Assistant 🤖💪 Ask me about workouts, coaches, sessions, nutrition tips, or anything fitness-related!",
  time: new Date(),
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll triggered by message/typing state changes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: getBotReply(text),
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Button */}
      <motion.button
        data-ocid="ai_assistant.open_modal_button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center cursor-pointer"
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="ai_assistant.dialog"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border border-border bg-card flex flex-col overflow-hidden"
            style={{ height: 500 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm leading-none">
                  FitHub AI Assistant
                </p>
                <p className="text-xs text-white/70 mt-0.5">
                  Always here to help
                </p>
              </div>
              <button
                type="button"
                data-ocid="ai_assistant.close_button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.role === "bot" && (
                      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[78%] flex flex-col gap-0.5 ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-xs text-muted-foreground px-1">
                        {fmt(msg.time)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex gap-2 items-end"
                    >
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground/60 block"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={endRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border flex gap-2 shrink-0">
              <Input
                ref={inputRef}
                data-ocid="ai_assistant.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything fitness..."
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button
                data-ocid="ai_assistant.submit_button"
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
