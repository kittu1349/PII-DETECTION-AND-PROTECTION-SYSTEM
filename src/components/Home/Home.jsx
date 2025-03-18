import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Shield, Eye, Files, Lock, Database, Key, Facebook, Twitter, Instagram, Linkedin, Mail, EyeOff, ArrowRight,MapPin } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import images
import securityIllustration from '../../Images/security-illustration.png';
import circle from '../../Images/Ellipse.png';
import sectionthree from "../../Images/Sectionthree.png";
import image1 from '../../Images/Aadhar.jpeg';
import image2 from '../../Images/cowin.jpeg';
import image3 from '../../Images/DOT.jpg';
import logo from '../../Images/logo.png';

// Import tech stack images
import nodejsImg from '../../Images/nodejs.png';
import reactImg from '../../Images/react.png';
import tailwindImg from '../../Images/tailwind.png';
import mongodbImg from '../../Images/mongodb.png';
import ethereumImg from '../../Images/ethereum.png';
import solidityImg from '../../Images/solidity.png';
import cloudinaryImg from '../../Images/cloudinary.png';
import pythonImg from '../../Images/python.png';
import numpyImg from '../../Images/numpy.png';
import flaskImg from '../../Images/flask.png';
import authenticatorImg from '../../Images/authenticatar.jpeg';

// Import service images
import piiDetectionImg from '../../Images/piidetection.png';
import piiMaskingImg from '../../Images/masking.png';
import cloudStorageImg from '../../Images/cloud.png';
import blockchainImg1 from '../../Images/blockchain.png';
import adminControlImg from '../../Images/admin.png';
import complianceImg from '../../Images/report.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  // Services data
  const services = [
    { Icon: Shield, title: 'PII Detection', active: false, paragraph: "Our advanced algorithms identify and flag personally identifiable information (PII) in your documents with high accuracy." },
    { Icon: Lock, title: 'Data Encryption', active: false, paragraph: "We use state-of-the-art encryption methods to secure your sensitive data, ensuring it remains protected at all times." },
    { Icon: EyeOff, title: 'PII Masking', active: true, paragraph: "Selectively mask or blur out specific PII fields in your documents while maintaining the integrity of the rest of the content." },
    { Icon: Database, title: 'Blockchain Auditing', active: false, paragraph: "Leverage blockchain technology for tamper-proof auditing, ensuring the highest level of transparency and security." },
    { Icon: Files, title: 'Multiple Document Support', active: false, paragraph: "Protect your PII across multiple documents simultaneously, streamlining your workflow." },
  ];

  // Case studies data
  const caseStudies = [
    {
      image: image1,
      date: "OCTOBER 2023",
      title: "Aadhaar Data Leak",
      description: "The data breach noticed by Resecurity mentioned that on October 9, a threat actor going by the alias 'pwn0001' posted a thread on Breach Forums brokering access to 815 million 'Indian Citizen Aadhaar and Passport' records",
      linkText: "Read full case study",
      link:`https://economictimes.indiatimes.com/tech/technology/aadhar-data-leak-personal-data-of-81-5-crore-indians-on-sale-on-dark-web-report/articleshow/104856898.cms?from=mdr`
    },
    {
      image: image2,
      date: "JUNE 2023",
      title: "Cowin Data Leak",
      description: " On June 12, reports emerged that a bot on the messaging platform Telegram was allegedly returning personal data of Indian citizens who registered with the COVID-19 vaccine intelligence network (CoWIN) portal for vaccination purposes. The bot spewed out personal details like name, Aadhaar and passport numbers upon entry of phone numbers.",
      linkText: "Explore the incident",
      link:`https://www.thehindu.com/sci-tech/technology/explained-what-does-the-alleged-cowin-data-leak-reveal/article66980831.ece`
    },
    {
      image: image3,
      date: "JANUARY 2024",
      title: "Indian Telecom Data Breach",
      description: "The Department of Telecom has asked service operators for a security audit of their systems following claims by a cybersecurity firm that data of 750 million Indian subscribers has been leaked, a government official said. Cybersecurity firm CloudSEK has claimed that its researchers have found that hackers are selling 1.8 terabyte of a database comprising 750 million Indian mobile consumers on the dark web.",
      linkText: "Learn more",
      link:`https://economictimes.indiatimes.com/industry/telecom/telecom-news/cybersecurity-co-claims-data-leak-of-750-mn-telecom-users-dot-asks-telcos-for-security-audit/articleshow/107239398.cms?from=mdr`
    }
  ];

  // Development approach data
  const developmentApproach = [
    {
      title: "Advanced PII Detection",
      description: "Our application uses cutting-edge machine learning and natural language processing techniques to accurately identify PII in various document formats, including government-issued IDs like Aadhaar, PAN, and driving licenses.",
      image: piiDetectionImg,
    },
    {
      title: "Intelligent PII Masking",
      description: "We offer multiple masking options for different types of PII, allowing users to choose between full redaction, partial masking, or tokenization. Our system ensures that sensitive information is protected while maintaining document usability.",
      image: piiMaskingImg,
    },
    {
      title: "Secure Cloud Storage",
      description: "Documents are securely stored using advanced encryption techniques. We utilize Cloudinary for efficient cloud storage, with options for multi-cloud solutions to ensure data redundancy and availability.",
      image: cloudStorageImg,
    },
    {
      title: "Blockchain-Based Tamper Detection",
      description: "We implement blockchain technology to create an immutable record of document hashes, allowing for easy detection of any unauthorized alterations to the original document or its PII content.",
      image: blockchainImg1,
    },
    {
      title: "Robust Admin Controls",
      description: "Our admin panel features two-factor authentication using Google Authenticator and role-based access control. Admins can securely view decrypted data and manage user permissions with a comprehensive audit trail.",
      image: adminControlImg,
    },
    {
      title: "Compliance and Reporting",
      description: "Our system is designed with data protection regulations in mind. We provide built-in compliance reporting features to help organizations meet GDPR, CCPA, and other relevant data protection standards.",
      image: complianceImg,
    },
  ];

  // Tech stack data
  const techStackCategories = [
    {
      title: "All",
      items: [
        { name: "Node.js", image: nodejsImg },
        { name: "React", image: reactImg },
        { name: "Tailwind", image: tailwindImg },
        { name: "MongoDB", image: mongodbImg },
        { name: "Ethereum", image: ethereumImg },
        { name: "Solidity", image: solidityImg },
        { name: "Cloudinary", image: cloudinaryImg },
        { name: "Python", image: pythonImg },
        { name: "Numpy", image: numpyImg },
        { name: "Flask", image: flaskImg },
      ]
    },
    {
      title: "Backend",
      items: [
        { name: "Node.js", image: nodejsImg },
        { name: "Authenticator", image: authenticatorImg },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "React", image: reactImg },
        { name: "Tailwind", image: tailwindImg },
      ],
    },
    {
      title: "Databases",
      items: [
        { name: "MongoDB", image: mongodbImg },
      ],
    },
    {
      title: "Blockchain",
      items: [
        { name: "Ethereum", image: ethereumImg },
        { name: "Solidity", image: solidityImg },
      ],
    },
    {
      title: "Cloud",
      items: [
        { name: "Cloudinary", image: cloudinaryImg },
      ],
    },
    {
      title: "ML Model",
      items: [
        { name: "Python", image: pythonImg },
        { name: "Numpy", image: numpyImg },
        { name: "Flask", image: flaskImg },
      ],
    },
  ];

  // Development process steps
  const steps = [
    {
      id: 1,
      title: "PII Detection",
      description: "Implement advanced algorithms to identify and locate Personally Identifiable Information within your data.",
      icon: Eye
    },
    {
      id: 2,
      title: "Data Masking",
      description: "Apply sophisticated masking techniques to protect sensitive information while maintaining data utility.",
      icon: Shield
    },
    {
      id: 3,
      title: "AES Encryption",
      description: "Utilize AES encryption to secure masked data, ensuring the highest level of protection for sensitive information.",
      icon: Lock
    },
    {
      id: 4,
      title: "Blockchain Audit",
      description: "Implement blockchain technology for tamper-proof audit trails, enhancing transparency and accountability.",
      icon: Database
    },
    {
      id: 5,
      title: "2FA Integration",
      description: "Integrate Google Authenticator for robust two-factor authentication, adding an extra layer of security.",
      icon: Key
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  // Scroll animation hook
  const useScrollAnimation = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();
  
    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);
  
    return [ref, controls];
  };

  // Gradient backgrounds
  const heroGradient = "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600";
  const sectionGradient = "bg-gradient-to-r from-purple-200 via-pink-100 to-indigo-200";

  // Component for Case Study
  const CaseStudy = ({ image, date, title, description, linkText,link }) => {
    const [ref, controls] = useScrollAnimation();

    return (
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
        }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex"
        whileHover={{ scale: 1.05 }}
      >
        <img className="w-1/3 h-full object-cover" src={image} alt={title} />
        <div className="p-6 w-2/3">
          <div className="text-indigo-600 font-semibold mb-1">{date}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          
          <motion.a 
            href={link} 
            className="text-pink-500 hover:text-pink-600 transition duration-300 inline-flex items-center text-sm font-medium"
            whileHover={{ x: 5 }}
          >
            {linkText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </motion.a>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`flex flex-col md:flex-row items-center justify-between py-20 px-8 md:px-16 relative ${sectionGradient} text-black`}
      >
        <motion.div variants={slideIn} className="w-full md:w-1/2 mb-12 md:mb-0 z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif leading-tight">
            PII DETECTION AND PROTECTION SYSTEM
          </h1>
          <h2 className="text-xl md:text-2xl mb-6 font-serif">BY INVINCIBLES</h2>
          <div className="w-24 h-1 bg-white mb-8"></div>
          <p className="mb-10 text-lg max-w-lg">Innovative solution for Detecting and safeguarding PII in Digital Documents</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition duration-300 shadow-lg hover:bg-blue-100"
            onClick={() => navigate("/signup")}
          >
            Let's get started!
          </motion.button>
        </motion.div>
        <motion.div 
          variants={slideIn}
          className="w-full md:w-1/2 relative"
        >
          <img src={securityIllustration} alt="Security Illustration" className="w-full object-contain" />
        </motion.div>
        <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2">
          <img src={circle} alt="" className="w-24 h-24 animate-pulse" />
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`pt-8  px-8 md:px-16 relative z-10 ${sectionGradient}`}
      >
        <h2 className="text-4xl font-semibold text-center mb-16 text-gray-800">Services we offer</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl ${
                  service.active ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white hover:bg-purple-50'
                }`}
              >
                <service.Icon className="w-16 h-16 mx-auto mb-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-center mb-4 text-purple-800">{service.title}</h3>
                <p className="text-sm text-gray-600 text-center">{service.paragraph}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* Data Safeguard Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`pt-8 px-8 md:px-16 relative z-10 ${sectionGradient}`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div variants={slideIn} className="md:w-1/2 md:pr-12 flex flex-col justify-center">
              <div className="w-24 h-2 bg-purple-600 mb-8 rounded-full"></div>
              <h2 className="text-5xl font-bold mb-6 text-gray-800 leading-tight">Safeguard Your Data</h2>
              <h3 className="text-3xl font-semibold text-purple-600 mb-8">Advanced PII Detection</h3>
              <p className="text-gray-600 mb-10 text-xl leading-relaxed">
                Protect sensitive information with our cutting-edge PII detection technology designed 
                specifically for government agencies. Our solution ensures the highest level of data 
                security and compliance.
              </p>
              <motion.button 
                className="inline-flex items-center text-purple-600 font-semibold text-xl 
                           hover:text-purple-800 transition-colors duration-300 group"
                whileHover={{ x: 10 }}
              >
                See more Information
                <ArrowRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </motion.div>
            <motion.div 
              variants={slideIn}
              className="md:w-1/2 mt-12 md:mt-0 flex justify-center items-center"
            >
              <img 
                src={sectionthree}
                alt="Data Safeguard Illustration" 
                className="w-full max-w-lg rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Case Studies Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`px-8 md:px-16  ${sectionGradient}`}
      >
        <div className="container mx-auto flex flex-col">
          <h2 className="mb-16 text-center">
            <span className="block text-3xl font-light text-gray-600">Real-Life Challenges</span>
            <span className="block text-5xl font-bold text-gray-800 mt-2">We Can Overcome</span>
          </h2>
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <CaseStudy key={index} {...study} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Development Approach Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`py-8 px-8 md:px-16 ${sectionGradient}`}
      >
        <h2 className="text-center mb-16">
          <span className="block text-3xl font-normal text-gray-600">Our design and</span>
          <span className="block text-5xl font-bold text-gray-800 mt-2">development approach</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developmentApproach.map((approach, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <img src={approach.image} alt={approach.title} className="w-20 h-20 mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-center">{approach.title}</h3>
              <p className="text-gray-600 text-center">{approach.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`py-8 px-8 md:px-16  ${sectionGradient}`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-16">
            <span className="block text-4xl font-light text-gray-600">Our</span>
            <span className="block text-6xl font-bold text-gray-800 mt-2">Tech Stack</span>
          </h2>
          
          <div className="flex justify-between mb-12 overflow-x-auto pb-4">
            {techStackCategories.map((category) => (
              <motion.button
                key={category.title}
                className={`px-6 py-3 text-lg font-medium transition-colors duration-300 ${
                  activeCategory === category.title 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                onClick={() => setActiveCategory(category.title)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.title}
              </motion.button>
            ))}
          </div>

          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12"
            variants={fadeIn}
          >
            {techStackCategories
              .find(category => category.title === activeCategory)
              .items.map((item) => (
                <motion.div 
                  key={item.name} 
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-contain mb-4"
                  />
                  <p className="text-lg text-gray-600 text-center font-medium">{item.name}</p>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Development Process Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`py-8 px-8 md:px-16 ${sectionGradient}`}
      >
        <h2 className="text-center mb-16">
          <span className="block text-3xl font-light text-gray-600">How development</span>
          <span className="block text-5xl font-bold text-gray-800 mt-2">through Alcaline works</span>
        </h2>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full border-t-2 border-pink-300"></div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative md:w-1/5 text-center px-4 flex-grow flex-shrink"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className="border-2 border-gray-200 rounded-lg p-8 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 min-h-[300px] flex flex-col justify-between"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <div>
                    <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-pink-600 text-2xl font-semibold mb-4">
                      {step.id}. {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 -right-4 w-8 h-8 bg-pink-500 rounded-full z-10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-b from-gray-50 to-white text-gray-700 py-16 shadow-inner"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="flex flex-wrap justify-between items-start space-y-12 lg:space-y-0">
            {/* Logo and Description */}
            <div className="w-full lg:w-1/3 pr-4">
              <div className="flex items-center space-x-3 mb-6">
                <img src={logo} alt="logo" className="h-12 w-12 text-blue-600" />
                <span className="text-3xl font-bold text-gray-800">Privacy Sentinels</span>
              </div>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Empowering organizations with cutting-edge PII detection and protection systems. 
                Safeguarding your data with advanced encryption and blockchain technology.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {['Home', 'About Us', 'Services', 'Contact'].map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a href="#" className="text-lg text-gray-600 hover:text-blue-500 transition duration-300 flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>{link}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Contact Information */}
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-lg text-gray-600">
                  <Mail className="h-6 w-6" />
                  <span>info@privacysentinels.com</span>
                </li>
                <li className="flex items-center space-x-3 text-lg text-gray-600">
                  <MapPin className="h-6 w-6" />
                  <span>MSIT Janakapuri, New Delhi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Follow Us</h3>
            <div className="flex justify-center space-x-8">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }, index) => (
                <motion.a 
                  key={index} 
                  href={href} 
                  className="text-gray-400 hover:text-blue-500 transition duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Icon className="h-8 w-8" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 text-center text-lg text-gray-500">
            © {new Date().getFullYear()} Privacy Sentinels. All rights reserved.
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;