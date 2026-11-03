import { motion } from 'framer-motion';

export default function PhotoGallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p className="font-script text-3xl text-rose-gold">Cherished Moments</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-burgundy sm:text-5xl">
            Our Photo Gallery
          </h2>
          <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex min-h-56 max-w-3xl items-center justify-center rounded-2xl border border-gold/30 bg-white/40 px-6 text-center shadow-sm"
        >
          <p className="font-script text-3xl text-rose-gold sm:text-4xl">Coming Soon</p>
        </motion.div>
      </div>
    </section>
  );
}