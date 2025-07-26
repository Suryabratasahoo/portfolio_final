"use client"

import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Send, Instagram } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null!) // non-null assertion to satisfy RefObject<HTMLElement>
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const formY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const infoY = useTransform(scrollYProgress, [0, 1], [70, -70])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
        variant: "default",
      })
    }catch(error){
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      })
    }
    
    
    form.reset()
  }

  const contactItems = [
    {
      icon: <Mail className="h-4 w-4 text-primary" />,
      title: "Email",
      value: "suryabratasahoo882@gmail.com",
      href: "mailto:suryabratasahoo882@gmail.com",
    },
    {
      icon: <Phone className="h-4 w-4 text-primary" />,
      title: "Phone",
      value: "+91 8249487461",
      href: "tel:+8249487461",
    },
    {
      icon: <MapPin className="h-4 w-4 text-primary" />,
      title: "Location",
      value: "Amaravati,Andhra Pradesh",
      href: null,
    },
  ]

  const socialLinks = [
    { icon: <Github className="h-4 w-4" />, href: "https://github.com/Suryabratasahoo", label: "GitHub" },
    { icon: <Linkedin className="h-4 w-4" />, href: "https://www.linkedin.com/in/surya-brata-sahoo-9971b928a/", label: "LinkedIn" },
    { icon: <Instagram className="h-4 w-4" />, href: "https://www.instagram.com/suryabrata_30/?hl=en", label: "Instagram" },
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            Contact
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Let's discuss your project or just say hello.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          <motion.div
            ref={formRef}
            style={{ y: formY }}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="px-6 py-4">
                  <CardTitle className="text-lg font-medium">Send a Message</CardTitle>
                  <CardDescription className="text-sm">
                    Fill out the form below and I'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  className="h-9 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your email"
                                  {...field}
                                  className="h-9 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Subject of your message"
                                {...field}
                                className="h-9 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Your message"
                                className="min-h-[120px] text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full rounded-full text-sm h-9 gap-2 group">
                          <span>Send Message</span>
                          <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            ref={infoRef}
            style={{ y: infoY }}
            initial={{ opacity: 0, x: 10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Feel free to reach out through any of these channels.
                </p>

                <div className="space-y-4">
                  {contactItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      whileHover={{ x: 3, scale: 1.01 }}
                    >
                      <div className="bg-primary/10 p-2 rounded-full">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h3 className="text-lg font-medium mb-4">Follow Me</h3>
                <div className="flex gap-3">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      className="bg-muted p-2 rounded-full hover:bg-primary/10 transition-colors"
                      aria-label={link.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

