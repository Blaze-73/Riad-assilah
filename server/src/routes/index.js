import express from 'express';
import authRoutes from './auth.js';
import inquiryRoutes from './inquiries.js';
import roomRoutes from './rooms.js';
import testimonialRoutes from './testimonials.js';
import galleryRoutes from './gallery.js';
import bookingRoutes from './bookings.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/rooms', roomRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/gallery', galleryRoutes);
router.use('/bookings', bookingRoutes);

export default router;
