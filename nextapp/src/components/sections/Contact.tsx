"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Twitter, Instagram, Linkedin, Loader2, Send, Phone, MapPin } from "lucide-react";

import { ContactSchema, type ContactFormValues } from "@/lib/validations";
import { submitContactForm } from "@/actions/contact";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await submitContactForm(data);
      
      if (response.success) {
        toast.success(response.message || "Message sent successfully!");
        reset();
      } else {
        toast.error(response.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin": return <Linkedin className="h-5 w-5" />;
      case "twitter": return <Twitter className="h-5 w-5" />;
      case "instagram": return <Instagram className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <section id="contact" className="py-24 bg-background dark:bg-[#030712] relative border-t border-border dark:border-slate-900/40">
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle title="Get in Touch" subtitle="Contact" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="right" delay={0.1}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground tracking-wide">
                  Let&apos;s Connect!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  Have a project in mind, an internship opportunity, or just want to chat about programming and cybersecurity? Drop me a line!
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-4">
              
              {/* Email Card */}
              <ScrollReveal direction="right" delay={0.15}>
                <Card className="bg-card/30 dark:bg-slate-900/30 border-border dark:border-slate-900 hover:border-border/80 dark:hover:border-slate-800/80 transition-all duration-300 group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background dark:bg-slate-950 border border-border dark:border-slate-900 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Email Address</span>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm sm:text-base font-bold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Location Card */}
              <ScrollReveal direction="right" delay={0.2}>
                <Card className="bg-card/30 dark:bg-slate-900/30 border-border dark:border-slate-900 hover:border-border/80 dark:hover:border-slate-800/80 transition-all duration-300 group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background dark:bg-slate-950 border border-border dark:border-slate-900 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Current Location</span>
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        GLA University, Mathura, UP, India
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Social Channels List */}
              <ScrollReveal direction="right" delay={0.25}>
                <Card className="bg-card/30 dark:bg-slate-900/30 border-border dark:border-slate-900 p-6">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-4">Follow Me On</span>
                  <div className="flex flex-wrap gap-3">
                    {SOCIAL_LINKS.filter(s => s.platform !== "GitHub").map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide border border-border dark:border-slate-800 bg-background dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:text-foreground hover:border-blue-500/50 hover:bg-background/80 dark:hover:bg-slate-900/40 transition-all cursor-pointer shadow-sm"
                      >
                        {getSocialIcon(link.platform)}
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>

            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={0.15}>
              <Card className="bg-card/40 dark:bg-slate-900/40 border-border/80 dark:border-slate-900/80 backdrop-blur-sm p-6 sm:p-8 relative overflow-hidden">
                {/* Thin glow top border */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-background dark:bg-slate-950/60 border-border dark:border-slate-800 text-foreground dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-11"
                        disabled={isLoading}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-background dark:bg-slate-950/60 border-border dark:border-slate-800 text-foreground dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-11"
                        disabled={isLoading}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="bg-background dark:bg-slate-950/60 border-border dark:border-slate-800 text-foreground dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-11"
                      disabled={isLoading}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Write your message here..."
                      className="bg-background dark:bg-slate-950/60 border-border dark:border-slate-800 text-foreground dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 min-h-32 resize-none"
                      disabled={isLoading}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 px-5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)] border-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
