import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero section with gradient */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-indigo-800 text-white py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Bienvenue sur E-Commerce
            </h1>
            <p className="text-indigo-100 text-lg sm:text-xl mb-10 leading-relaxed">
              Découvrez notre catalogue, ajoutez des articles à votre panier et passez commande en toute simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="btn btn-lg bg-white !text-primary hover:bg-indigo-50 hover:!text-primary font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Voir le catalogue
              </Link>
              <Link
                to="/register"
                className="btn btn-lg bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 font-semibold backdrop-blur-sm transition-all"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container py-16 px-4">
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-white border border-slate-200 shadow-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Catalogue varié</h3>
            <p className="text-sm text-slate-500">Parcourez notre sélection de produits par catégorie</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white border border-slate-200 shadow-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Panier simple</h3>
            <p className="text-sm text-slate-500">Ajoutez vos articles et gérez les quantités facilement</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white border border-slate-200 shadow-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Commande sécurisée</h3>
            <p className="text-sm text-slate-500">Validez votre commande en quelques clics</p>
          </div>
        </div>
      </section>
    </div>
  );
}
