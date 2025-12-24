import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  Menu,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// ✅ Framer Motion
import { motion, AnimatePresence } from "framer-motion";

/** -----------------------------
 *  API Base URL (CRA .env)
 *  ----------------------------*/
const API_BASE =
  (process.env.REACT_APP_API_BASE_URL || "").trim().replace(/\/$/, "");

/** -----------------------------
 *  Framer Motion Variants
 *  ----------------------------*/
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const modalWrap = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalCard = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } },
};

export function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Name is required"),
      phone: Yup.string()
        .trim()
        .matches(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number")
        .required("Phone is required"),
      message: Yup.string().trim().required("Message is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      try {
        setStatus(null);

        if (!API_BASE) {
          throw new Error(
            "API URL not set. Add REACT_APP_API_BASE_URL in .env and restart the React server."
          );
        }

        const res = await fetch(`${API_BASE}/add-leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            phone: values.phone,
            message: values.message,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to submit lead");
        }

        await res.json();
        resetForm();
        setStatus({ success: "Submitted successfully!" });

        // ✅ Auto close popup on success
        setTimeout(() => setShowLeadPopup(false), 1200);
      } catch (e) {
        setStatus({ error: e.message || "Something went wrong" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const errorClass = "mt-1 text-[11px] text-red-500";

  // ✅ Popup after reload 3s (show only once per session)
  useEffect(() => {

    const t = setTimeout(() => {
      setShowLeadPopup(true);
      sessionStorage.setItem("leadPopupShown", "1");
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  // ✅ ESC close popup
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowLeadPopup(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const featuredSlides = [
    {
      id: 1,
      title: "3 BHK APARTMENT",
      beds: "3-Bed",
      baths: "2-Bath",
      area: "1600 SQFT",
      description: "3-bedroom, 2-bathroom homes with privacy and natural light.",
      price: "1.60 Cr",
      tagLine: "Flash Sale 25% Off",
      subTagLine: "Today's Top Pick!",
      image: "/images/bedroom.webp",
    },
    {
      id: 2,
      title: "4 BHK APARTMENT",
      beds: "4-Bed",
      baths: "3-Bath",
      area: "2000 SQFT",
      description: "4-bedroom, 3-bathroom homes with privacy and natural light.",
      price: "2.36 Cr",
      tagLine: "New Launch",
      subTagLine: "Limited Inventory",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1800&auto=format&fit=crop",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = featuredSlides[activeIndex];

  const prevSlide = () =>
    setActiveIndex((prev) =>
      prev === 0 ? featuredSlides.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setActiveIndex((prev) =>
      prev === featuredSlides.length - 1 ? 0 : prev + 1
    );

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* ✅ LEAD POPUP (Framer Motion) */}
      <AnimatePresence>
        {showLeadPopup && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center px-4"
            variants={modalWrap}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              onClick={() => setShowLeadPopup(false)}
              className="absolute inset-0 bg-black/60"
              aria-label="Close popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-[1000] w-full max-w-[520px] rounded-3xl border border-[#FFEEC3] bg-[#FFF7E5] shadow-2xl"
              variants={modalCard}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6">
                <div>
                  <p className="text-[18px] font-semibold text-[#0F3F3B]">
                    Enquire Now
                  </p>
                  <p className="text-[14px] mt-1 text-slate-600">
                    Get brochure / pricing / site visit details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLeadPopup(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-slate-50"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="px-6 sm:px-[64px] py-8">
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#5b5a5a]"
                    >
                      NAME*
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B]"
                      placeholder="Enter your name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <p className={errorClass}>{formik.errors.name}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#5b5a5a]"
                    >
                      PHONE*
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B]"
                      placeholder="Enter your phone number"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <p className={errorClass}>{formik.errors.phone}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#5b5a5a]"
                    >
                      MESSAGE*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B] resize-none"
                      placeholder="Type your message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.message && formik.errors.message ? (
                      <p className={errorClass}>{formik.errors.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="rounded-full bg-[#0F3F3B] w-[175px] h-[46px] text-[16px] font-semibold uppercase tracking-[0.16em] text-[#FFEFC4] hover:bg-[#0a2926] disabled:opacity-60"
                    >
                      {formik.isSubmitting ? "Submitting..." : "SUBMIT NOW"}
                    </motion.button>

                    {formik.status?.success && (
                      <p className="text-sm mt-2 mx-1 text-green-700">
                        {formik.status.success}
                      </p>
                    )}
                    {formik.status?.error && (
                      <p className="text-sm mt-2 mx-1 text-red-600">
                        {formik.status.error}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section
        id="home"
        className="w-full min-h-[110vh] bg-white overflow-x-hidden"
      >
        <div className="w-full min-h-[110vh] overflow-hidden lg:border-0 shadow-sm lg:shadow-none">
          <div className="grid min-h-[110vh] grid-cols-1 lg:grid-cols-[45%_55%]">
            {/* LEFT PANEL */}
            <div className="relative bg-[#0F3F3B] px-6 py-12 sm:px-10 lg:px-16 lg:py-6">
              {/* Logo + Mobile Menu Icon (mobile only) */}
              <div className="sm:mt-[20px] flex items-center justify-between gap-3">
                <img
                  src="/images/logo_1.svg"
                  alt="SLV Logo"
                  className="h-auto w-[220px] sm:w-[220px] md:w-[260px] lg:w-[326px]"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="lg:hidden inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              {/* Mobile menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="lg:hidden mt-4 rounded-2xl bg-white/95 backdrop-blur p-4 py-6 shadow-lg"
                  >
                    <nav className="flex flex-col gap-3 text-sm font-medium text-slate-800">
                      <a
                        href="#home"
                        onClick={closeMobileMenu}
                        className="hover:text-slate-900"
                      >
                        Home
                      </a>
                      <a
                        href="#about"
                        onClick={closeMobileMenu}
                        className="hover:text-slate-900"
                      >
                        About Us
                      </a>
                      <a
                        href="#gallery"
                        onClick={closeMobileMenu}
                        className="hover:text-slate-900"
                      >
                        Gallery
                      </a>
                      <a
                        href="#project"
                        onClick={closeMobileMenu}
                        className="hover:text-slate-900"
                      >
                        Projects
                      </a>

                      <a
                        href="#contact"
                        onClick={closeMobileMenu}
                        className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0F3F3B] px-4 py-2 text-xs font-semibold text-[#E0B24A]"
                      >
                        Let&apos;s Connect
                      </a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="mt-10 sm:mt-16 lg:mt-28"
              >
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl font-brushelva leading-[1.05] text-white sm:text-[72px]"
                >
                  Discover Your <br />
                  New <span className="text-[#E0B24A]">Home</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-md text-sm leading-7 sm:leading-8 text-white/70 sm:text-[22px]"
                >
                  Well-planned 3 & 4 BHK homes offering modern living standards,
                  strategic connectivity & strong long-term value appreciation in
                  Yelahanka
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10">
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href="#contact"
                    className="inline-flex rounded-full bg-[#E0B24A] px-8 py-3 text-sm font-semibold text-[#0F3F3B]"
                  >
                    GET BROCHURE
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT PANEL */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="relative min-h-[420px] lg:min-h-[110vh]"
            >
              <div className="hidden lg:block absolute top-4 sm:top-6 left-1/2 z-20 w-[94%] sm:w-[90%] max-w-[620px] -translate-x-1/2">
                <div className="flex items-center justify-between gap-3 rounded-full bg-white/90 px-4 sm:px-6 py-3 shadow-md backdrop-blur">
                  <nav className="flex gap-14 text-sm font-medium text-slate-700 whitespace-nowrap">
                    <a href="#home" className="hover:text-slate-900">
                      Home
                    </a>
                    <a href="#about" className="hover:text-slate-900">
                      About Us
                    </a>
                    <a href="#gallery" className="hover:text-slate-900">
                      Gallery
                    </a>
                    <a href="#project" className="hover:text-slate-900">
                      Projects
                    </a>
                  </nav>

                  <a
                    href="#contact"
                    className="shrink-0 rounded-full bg-[#0F3F3B] px-4 py-2 text-xs font-semibold text-[#E0B24A]"
                  >
                    Let&apos;s Connect
                  </a>
                </div>
              </div>

              <img
                src="/images/hero_image.webp"
                alt="Apartment building"
                className="w-full object-cover h-[420px] sm:h-[520px] lg:h-full"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <motion.section
        id="about"
        className="w-full bg-white py-16 sm:py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-0">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block font-brushelva border-t-2 border-[#E0B24A] pt-2 text-md uppercase tracking-widest text-slate-600">
                About Us
              </span>

              <h2 className="mt-4 text-3xl font-brushelva text-[#0F3F3B] sm:text-[44px]">
                SLV GOLDEN TOWERS
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-[18px]">
                Golden Towers is a thoughtfully planned residential community
                that blends modern architecture with everyday comfort. Designed
                for families and professionals, the project offers spacious
                homes, premium specifications, and a lifestyle that balances
                convenience and elegance
              </p>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 rounded-full bg-[#0F3F3B] px-6 py-3 text-[18px] font-semibold text-[#FFF]"
              >
                SCHEDULE A VISIT
              </motion.button>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-3"
            >
              {[
                { label: "3+ ACRES OF\nGREENERY", icon: "/images/nature.svg" },
                {
                  label: "242 RESIDENCES,\n2 TOWERS",
                  icon: "/images/apartment.svg",
                },
                {
                  label: "3, 4 BHK\nLAYOUTS",
                  icon: "/images/holiday_village.svg",
                },
                { label: "70% OPEN\nGREEN SPACE", icon: "/images/compost.svg" },
                {
                  label: "100% VASTU\nCOMPLIANT",
                  icon: "/images/in_home_mode.svg",
                },
                { label: "INFINITY\nPOOL", icon: "/images/pool.svg" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                    <img src={item.icon} alt="" className="object-contain" />
                  </div>
                  <p className="whitespace-pre-line text-[14px] sm:text-[16px] font-medium text-slate-700">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* GALLERY */}
      <motion.section
        id="gallery"
        className="w-full bg-[#FBF3E6] py-16 sm:py-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-0">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-3 h-[3px] w-14 rounded-full bg-[#E0B24A]"
            />
            <motion.p
              variants={fadeUp}
              className="text-[20px] font-brushelva text-slate-700"
            >
              Discover Gallery
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-brushelva text-[#0F3F3B] sm:text-[44px]"
            >
              Life Inside Our Apartments
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <motion.div
              variants={fadeUp}
              className="overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-6"
            >
              <img
                src="/images/gallery_1.webp"
                alt="Apartment towers"
                className="h-[240px] sm:h-[320px] lg:h-[420px] w-full object-cover"
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-6"
            >
              <div className="flex h-full flex-col lg:flex-row">
                <div className="relative flex-1">
                  <img
                    src="/images/gallery_2.webp"
                    alt="Amenities court"
                    className="h-[240px] sm:h-[320px] lg:h-[420px] w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {[
              { src: "/images/gallery_3.webp", alt: "Swimming pool" },
              { src: "/images/gallery_4.webp", alt: "Gym" },
              { src: "/images/gallery_5.webp", alt: "Green lawn" },
              { src: "/images/gallery_6.webp", alt: "Project aerial view" },
            ].map((img, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-3"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-[210px] sm:h-[240px] lg:h-[260px] w-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* PROJECT HEADER */}
      <motion.div
        id="project"
        className="mx-auto mt-[50px] mb-[30px] flex max-w-[1280px] flex-col gap-4 px-6 lg:flex-row lg:items-center lg:justify-between"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-[32px] sm:text-[44px] font-brushelva text-[#0F3F3B]">
          Featured Property
        </div>

        <div className="flex h-[46px] w-full lg:mt-[60px] lg:max-w-[520px] shadow-md items-center justify-center gap-2 rounded-full border border-[#FFF1BE] bg-[#FFFAE7] px-4 text-[13px] sm:text-[17px] text-[#0F3F3B]">
          <img src="/images/distance.svg" alt="location" className="h-5 w-5" />
          <span className="truncate">
            Down Bazar Road, Kogilu Cross, Yelahanka, Bengaluru
          </span>
        </div>
      </motion.div>

      {/* CAROUSEL */}
      <motion.div
        className="mx-auto mt-4 w-full max-w-[1280px] overflow-hidden rounded-[28px] shadow-sm"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="relative w-full">
          {/* IMAGE AREA */}
          <div className="relative h-[320px] sm:h-[460px] lg:h-[600px] overflow-hidden">
            <img
              src={active.image}
              alt={active.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

            {/* Right flash text */}
            <div className="absolute bottom-12 right-10 text-right text-white drop-shadow hidden sm:block">
              <p className="text-2xl font-medium">{active.tagLine}</p>
              <p className="mt-1 text-base">{active.subTagLine}</p>
            </div>

            {/* Dots */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-4 flex justify-center">
              <div className="pointer-events-auto flex gap-2 rounded-full bg-black/20 px-3 py-1">
                {featuredSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === activeIndex
                        ? "w-5 bg-white"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* OVERLAY CARD ONLY FOR sm+ */}
            <div className="hidden sm:block absolute left-10 bottom-10 z-20">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-2 w-[413px] h-[258px]"
              >
                <h3 className="text-[20px] font-semibold tracking-wide text-[#0F3F3B] my-3 mx-[30px]">
                  {active.title}
                </h3>

                <div className="my-5 mx-[10px] flex flex-wrap gap-2 text-[14px] text-slate-600">
                  <span className="rounded-full border border-[#777777] flex justify-center items-center gap-2 px-2.5 py-1">
                    <img src="/images/icon.svg" alt="" />
                    {active.beds}
                  </span>
                  <span className="rounded-full border border-[#777777] flex justify-center items-center gap-2 px-2.5 py-1">
                    <img src="/images/icon-1.svg" alt="" />
                    {active.baths}
                  </span>
                  <span className="rounded-full border border-[#777777] flex justify-center items-center gap-2 px-2.5 py-1">
                    <img src="/images/aspect_ratio.svg" alt="" />
                    {active.area}
                  </span>
                </div>

                <p className="mt-[15px] mx-[30px] text-[16px] leading-relaxed text-slate-600">
                  {active.description}
                </p>

                <hr className="w-[350px] my-3 bg-[#DAD8D8] mx-auto" />

                <div className="flex mx-[30px] items-center gap-6">
                  <div className="text-[14px]">
                    <span className="text-[26px] font-semibold text-[#1E4645]">
                      <span style={{ fontFamily: "arial" }}>₹&nbsp;</span>
                      {active.price}
                    </span>
                    &nbsp;&nbsp;
                    <span className="text-dark">Negotiable Price</span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={prevSlide}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      <ChevronLeftIcon />
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextSlide}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      <ChevronRightIcon />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* MOBILE CARD BELOW IMAGE */}
          <div className="sm:hidden relative z-10 px-3 pb-4 pt-2 bg-white">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-3"
            >
              <h3 className="text-[16px] font-semibold tracking-wide text-[#0F3F3B] mb-2">
                {active.title}
              </h3>

              <div className="flex flex-wrap gap-2 text-[12px] text-slate-600">
                <span className="rounded-full border border-[#777777] flex items-center gap-2 px-2 py-1">
                  <img src="/images/icon.svg" alt="" />
                  {active.beds}
                </span>
                <span className="rounded-full border border-[#777777] flex items-center gap-2 px-2 py-1">
                  <img src="/images/icon-1.svg" alt="" />
                  {active.baths}
                </span>
                <span className="rounded-full border border-[#777777] flex items-center gap-2 px-2 py-1">
                  <img src="/images/aspect_ratio.svg" alt="" />
                  {active.area}
                </span>
              </div>

              <p className="mt-2 text-[13px] leading-5 text-slate-600">
                {active.description}
              </p>

              <hr className="my-3 bg-[#DAD8D8]" />

              <div className="flex items-center justify-between gap-3">
                <div className="text-[12px]">
                  <span className="text-[18px] font-semibold text-[#1E4645]">
                    <span style={{ fontFamily: "arial" }}>₹&nbsp;</span>
                    {active.price}
                  </span>
                  <div className="text-slate-600">Negotiable</div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevSlide}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs hover:bg-slate-50"
                  >
                    <ChevronLeftIcon />
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextSlide}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-xs hover:bg-slate-50"
                  >
                    <ChevronRightIcon />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AMENITIES STRIP */}
      <motion.section
        className="w-full bg-white py-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-slate-100 bg-white px-4 sm:px-8 py-6 sm:py-8 shadow-sm">
            {/* Mobile = grid 2 cols, Desktop = row */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-between md:gap-0"
            >
              {[
                { icon: "/images/kabbadi.svg", label: "Childrens Play\nArea" },
                { icon: "/images/chair_umbrella.svg", label: "Swimming\nPool" },
                { icon: "/images/verified_user.svg", label: "24/7\nSecurity" },
                {
                  icon: "/images/solo_dining.svg",
                  label: "Multipurpose\nLawn",
                  hideOnMobile: true,
                },
                {
                  icon: "/images/parking_sign.svg",
                  label: "Visitors Parking\nArea",
                },
              ].map((it, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    variants={fadeUp}
                    className={`
                      flex flex-col items-center justify-center text-center md:flex-1
                      ${it.hideOnMobile ? "hidden md:flex" : ""}
                    `}
                  >
                    <div className="mb-2 text-[#D4A014]">
                      <img src={it.icon} alt="" />
                    </div>
                    <p className="whitespace-pre-line text-[14px] sm:text-[16px] font-medium text-slate-800">
                      {it.label}
                    </p>
                  </motion.div>

                  {/* Divider only on desktop */}
                  {i !== 4 && (
                    <div className="hidden md:block h-20 w-px bg-[#53535380]/30" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full bg-[#FBF3E6] py-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-0">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-3 h-[2px] w-[100px] rounded-full bg-[#FACC15]"
            />
            <motion.p
              variants={fadeUp}
              className="text-[20px] font-brushelva text-slate-700"
            >
              Near by Places
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-[16px] text-3xl font-brushelva text-[#0F3F3B] sm:text-[40px]"
            >
              Highlights Nearby
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {[
              { src: "/images/airport.webp", title: "Airports", dist: "18 Miles" },
              { src: "/images/metro.webp", title: "Metro", dist: "200 mtrs" },
              { src: "/images/shopping.webp", title: "Shopping Mall", dist: "500 mtrs" },
            ].map((c, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="overflow-hidden rounded-2xl bg-black/5 shadow-sm"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-[240px] sm:h-[290px] w-full">
                  <img
                    src={c.src}
                    alt={c.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                    <span className="text-sm font-medium">{c.title}</span>
                    <span className="text-xs">{c.dist}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* CONTACT */}
      <motion.section
        id="contact"
        className="w-full mt-[50px] bg-white py-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-0">
          <div className="grid gap-12 sm:gap-20 lg:grid-cols-[52%_48%] items-start">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                variants={fadeUp}
                className="mb-[16px] h-[2px] w-16 bg-[#FACC15]"
              />
              <motion.p
                variants={fadeUp}
                className="text-[20px] font-brushelva text-slate-700"
              >
                Contact
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-[16px] text-3xl font-brushelva text-[#0F3F3B] sm:text-[44px]"
              >
                GET IN TOUCH
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-lg text-[13px] leading-6 text-slate-600 sm:text-[18px]"
              >
                Our relationship manager will connect with you shortly to provide
                complete details about Golden Towers, including residence
                configurations, pricing, amenities, and private site visit
                arrangements.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FFEFC4] text-[#0F3F3B]">
                    <span className="text-lg">
                      <PhoneIcon />
                    </span>
                  </div>
                  <span className="text-[18px] sm:text-[18px] font-semibold text-[#0F3F3B]">
                    +91 9538752960
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FFEFC4] text-[#0F3F3B]">
                    <span className="text-lg">
                      <MailIcon />
                    </span>
                  </div>
                  <span className="text-[16px] sm:text-[18px] font-semibold text-[#0F3F3B] break-all">
                    contact@rathnabhoomidevelopers.com
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Form card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-3xl border border-[#FFEEC3] bg-[#FFF7E5] px-6 sm:px-[64px] w-full lg:w-[434px] lg:h-[420px] py-8 shadow-sm"
            >
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name2"
                    className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#0F3F3B]"
                  >
                    NAME*
                  </label>
                  <input
                    id="name2"
                    name="name"
                    type="text"
                    className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B]"
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className={errorClass}>{formik.errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="phone2"
                    className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#0F3F3B]"
                  >
                    PHONE*
                  </label>
                  <input
                    id="phone2"
                    name="phone"
                    type="text"
                    className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B]"
                    placeholder="Enter your phone number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <p className={errorClass}>{formik.errors.phone}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="message2"
                    className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#0F3F3B]"
                  >
                    MESSAGE*
                  </label>
                  <textarea
                    id="message2"
                    name="message"
                    rows={3}
                    className="mt-2 w-full rounded-md border border-[#F3E2B7] bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#0F3F3B] resize-none"
                    placeholder="Type your message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.message && formik.errors.message ? (
                    <p className={errorClass}>{formik.errors.message}</p>
                  ) : null}
                </div>

                <div>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="rounded-full bg-[#0F3F3B] w-[175px] h-[46px] text-[16px] font-semibold uppercase tracking-[0.16em] text-[#FFEFC4] hover:bg-[#0a2926] disabled:opacity-60"
                  >
                    {formik.isSubmitting ? "Submitting..." : "SUBMIT NOW"}
                  </motion.button>

                  {formik.status?.success && (
                    <p className="text-sm mt-2 mx-3 text-green-700">
                      {formik.status.success}
                    </p>
                  )}
                  {formik.status?.error && (
                    <p className="text-sm mt-2 mx-3 text-red-600">
                      {formik.status.error}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.section
        className="w-full mt-[100px] bg-[#1F4B48] text-white"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <div className="flex items-center justify-center">
            <img
              src="/images/logo_1.svg"
              alt="Rathna Bhoomi Developers"
              className="h-[56px] sm:h-[64px] w-auto sm:w-[354px]"
            />
          </div>

          <p className="mt-5 text-center text-[16px] leading-7 text-white/90">
            2nd Floor, No 23, E Block, Parindhi, 14A Dasarahalli Main Rd,
            <br />
            Sahakar Nagar, Bengaluru, Karnataka 560092
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F0DD] text-[#1F4B48]">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-[16px] text-white/90">Phone</p>
                <a
                  href="tel:+919538752960"
                  className="text-[18px] font-semibold text-white hover:underline"
                >
                  +91 9538752960
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F0DD] text-[#1F4B48]">
                <MailIcon />
              </div>
              <div>
                <p className="text-[16px] text-white/90">Email</p>
                <a
                  href="mailto:contact@rathnabhoomidevelopers.com"
                  className="text-[18px] font-semibold text-white hover:underline break-all"
                >
                  contact@rathnabhoomidevelopers.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F0DD] text-[#1F4B48]">
                <ClockIcon />
              </div>
              <div>
                <p className="text-[16px] text-white/90">Opening Hours</p>
                <p className="text-[18px] font-semibold text-white">
                  Mon to Sun 09:30 am - 06:30 pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
