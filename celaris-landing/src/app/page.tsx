"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Star, Sun, Zap, Shield, TrendingUp, CheckCircle, ArrowRight, Leaf, Euro } from "lucide-react"

export default function CelarisLandingPage() {
  const [stromVerbrauch, setStromVerbrauch] = useState(4500)
  const [dachFlaeche, setDachFlaeche] = useState(40)
  const [region, setRegion] = useState("Bayern")
  
  // ROI Berechnung
  const anlagenGroesse = Math.min(dachFlaeche * 0.15, stromVerbrauch * 0.0003) // kWp
  const investition = anlagenGroesse * 1200 // € pro kWp
  const foerderung = investition * 0.2 // 20% Förderung
  const jaehrlicheErsparnis = anlagenGroesse * 400 // € pro kWp/Jahr
  const amortisation = (investition - foerderung) / jaehrlicheErsparnis
  const roi20Jahre = (jaehrlicheErsparnis * 20) - (investition - foerderung)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Vielen Dank! Wir melden uns innerhalb von 24 Stunden.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold text-gray-900">Celaris</span>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            Jetzt Angebot anfordern
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
              🌞 Marktführer für Solar-Installationen
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Ihre eigene
              <span className="block text-amber-500">Solaranlage</span>
              in nur 30 Tagen
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Von der Planung bis zur Installation – wir machen Sie unabhängig von steigenden Strompreisen. 
              Mit bis zu 20% Förderung und garantierter Amortisation in unter 8 Jahren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6">
                Kostenlose Beratung buchen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 text-lg px-8 py-6">
                ROI-Rechner nutzen
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>5.000+ Installationen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>25 Jahre Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Finanzierung ab 99€/Monat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Calculator (ROI-Rechner) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Berechnen Sie Ihre Ersparnis
              </h2>
              <p className="text-xl text-gray-600">
                Sehen Sie sofort, wie viel Sie mit einer Solaranlage sparen können
              </p>
            </div>

            <Card className="border-2 border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                  Solar ROI-Rechner
                </CardTitle>
                <CardDescription>
                  Passen Sie die Werte an Ihre Situation an
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Eingaben */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Jährlicher Stromverbrauch (kWh)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[stromVerbrauch]}
                          onValueChange={(v) => setStromVerbrauch(v[0])}
                          min={2000}
                          max={15000}
                          step={500}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={stromVerbrauch}
                          onChange={(e) => setStromVerbrauch(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Durchschnitt: 4.500 kWh/Jahr</p>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Verfügbare Dachfläche (m²)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[dachFlaeche]}
                          onValueChange={(v) => setDachFlaeche(v[0])}
                          min={20}
                          max={200}
                          step={5}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={dachFlaeche}
                          onChange={(e) => setDachFlaeche(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Faustregel: 1 kWp ≈ 6-7 m²</p>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Region</Label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-md"
                      >
                        <option value="Bayern">Bayern</option>
                        <option value="Baden-Württemberg">Baden-Württemberg</option>
                        <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                        <option value="Andere">Andere</option>
                      </select>
                    </div>
                  </div>

                  {/* Ergebnisse */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm">Anlagengröße</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{anlagenGroesse.toFixed(1)} kWp</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Euro className="w-4 h-4" />
                          <span className="text-sm">Investition</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{investition.toLocaleString()} €</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Leaf className="w-4 h-4" />
                          <span className="text-sm">Förderung (20%)</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">-{foerderung.toLocaleString()} €</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Jährliche Ersparnis</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{jaehrlicheErsparnis.toLocaleString()} €</p>
                      </div>
                    </div>

                    <div className="border-t border-amber-200 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Amortisation in:</span>
                        <span className="text-2xl font-bold text-green-600">{amortisation.toFixed(1)} Jahren</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Gewinn nach 20 Jahren:</span>
                        <span className="text-3xl font-bold text-amber-600">{roi20Jahre.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6">
                  Jetzt kostenloses Angebot anfordern
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features / USPs */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Warum Celaris?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wir machen Solar einfach, transparent und profitabel für Sie
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Sun className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Premium-Qualität</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nur zertifizierte Komponenten von führenden Herstellern wie SunPower und SolarEdge.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Euro className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Beste Förderung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Wir kümmern uns um alle Förderanträge – bis zu 20% Zuschuss sichern wir für Sie.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">25 Jahre Garantie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rundum-Sorglos-Paket mit Leistungsgarantie, Produktgarantie und Wartung.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Schnelle Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Von der Beratung bis zur fertigen Anlage in nur 30 Tagen – garantiert.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-600">
              Über 5.000 zufriedene Hausbesitzer vertrauen auf Celaris
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-amber-100 shadow-md">
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Michael Weber</CardTitle>
                <CardDescription>München, Bayern</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Die Installation war super professionell. Nach nur 6 Jahren hat sich die Anlage bereits amortisiert. 
                  Absolute Empfehlung!"
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-md">
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Sandra Müller</CardTitle>
                <CardDescription>Stuttgart, Baden-Württemberg</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Von der ersten Beratung bis zur Inbetriebnahme alles perfekt organisiert. 
                  Die Förderanträge wurden komplett übernommen."
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-md">
              <CardHeader>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Thomas Schmidt</CardTitle>
                <CardDescription>Hamburg</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Beste Entscheidung! Unsere Stromrechnung ist um 85% gesunken. 
                  Das Team war immer erreichbar und kompetent."
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-amber-50 px-8 py-4 rounded-full">
              <span className="text-3xl font-bold text-amber-600">4.9/5</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-600">auf Trustpilot (2.341 Bewertungen)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-none">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900">
                  Kostenlose Beratung sichern
                </CardTitle>
                <CardDescription className="text-lg">
                  Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Ihr vollständiger Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ihre@email.de"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+49 123 456789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <select
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full mt-2 p-2 border rounded-md"
                      >
                        <option value="Bayern">Bayern</option>
                        <option value="Baden-Württemberg">Baden-Württemberg</option>
                        <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                        <option value="Andere">Andere</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Ihre Nachricht</Label>
                    <textarea
                      id="message"
                      placeholder="Erzählen Sie uns von Ihrem Projekt..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full mt-2 p-3 border rounded-md min-h-[120px]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg py-6"
                  >
                    Kostenlose Beratung anfordern
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    🔒 Ihre Daten sind sicher. Wir spammen nicht und geben Ihre Daten nicht weiter.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Bereit für Ihre eigene Solaranlage?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Starten Sie jetzt in eine nachhaltige Zukunft mit garantierten Einsparungen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6">
                Jetzt Angebot anfordern
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-6">
                📞 0800-CELARIS
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Kostenlose Beratung</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Unverbindliches Angebot</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>24h Rückmeldung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-xl font-bold">Celaris</span>
              </div>
              <p className="text-gray-400 text-sm">
                Ihr Partner für nachhaltige Energie-Lösungen seit 2015.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-500">Über uns</a></li>
                <li><a href="#" className="hover:text-amber-500">Karriere</a></li>
                <li><a href="#" className="hover:text-amber-500">Presse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-amber-500">Impressum</a></li>
                <li><a href="#" className="hover:text-amber-500">Datenschutz</a></li>
                <li><a href="#" className="hover:text-amber-500">AGB</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 0800-CELARIS</li>
                <li>✉️ info@celaris.de</li>
                <li>📍 München, Deutschland</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 Celaris GmbH. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  )
}
