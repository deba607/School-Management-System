import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  School,
  Users,
  BookOpen,
  Calendar,
  Award,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const data = {
  facebookLink: "https://facebook.com/edumanage",
  instaLink: "https://instagram.com/edumanage",
  twitterLink: "https://twitter.com/edumanage",
  services: {
    studentPortal: "/student-portal",
    teacherDashboard: "/teacher-dashboard",
    attendanceSystem: "/attendance-system",
    gradeManagement: "/grade-management",
  },
  about: {
    aboutUs: "/about-us",
    ourMission: "/our-mission",
    privacyPolicy: "/privacy-policy",
    termsOfService: "/terms-of-service",
  },
  help: {
    faqs: "/faqs",
    support: "/support",
    documentation: "/documentation",
  },
  contact: {
    email: "info@edumanage.com",
    phone: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City, LC 12345",
  },
  company: {
    name: "EduManage",
    description:
      "Comprehensive school management system that streamlines administrative tasks, enhances communication, and improves educational outcomes. Manage students, teachers, courses, and more with ease.",
    logo: "/logo.webp",
  },
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
];

const aboutLinks = [
  { text: "About Us", href: data.about.aboutUs },
  { text: "Our Mission", href: data.about.ourMission },
  { text: "Privacy Policy", href: data.about.privacyPolicy },
  { text: "Terms of Service", href: data.about.termsOfService },
];

const serviceLinks = [
  { text: "Student Portal", href: data.services.studentPortal },
  { text: "Teacher Dashboard", href: data.services.teacherDashboard },
  { text: "Attendance System", href: data.services.attendanceSystem },
  { text: "Grade Management", href: data.services.gradeManagement },
];

const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Support", href: data.help.support },
  { text: "Documentation", href: data.help.documentation, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="mt-16 w-full place-self-end rounded-t-xl bg-black border-t border-purple-500/30">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 text-purple-400 sm:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
                <School className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-semibold text-white">{data.company.name}</span>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-slate-300/90 sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 transition hover:text-purple-400">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-slate-400 transition hover:text-purple-400" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a className="text-slate-400 transition hover:text-purple-400" href={href}>
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-slate-400 transition hover:text-purple-400"
                      }`}
                    >
                      <span className="text-slate-400 transition hover:text-purple-400">{text}</span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-purple-500" />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      href="#"
                    >
                      <Icon className="size-5 shrink-0 text-purple-400 shadow-sm" />
                      {isAddress ? (
                        <address className="-mt-0.5 flex-1 not-italic text-slate-400 transition">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1 text-slate-400 transition">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-purple-500/30 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-slate-400">
              <span className="block sm:inline">© 2024 EduManage. All rights reserved.</span>
            </p>

            <p className="text-slate-400 mt-4 text-sm transition sm:order-first sm:mt-0">
              <span className="block sm:inline">Empowering Education Through Technology</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
