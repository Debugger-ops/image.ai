# Image AI Generator

A modern React-based AI image generation application built with TypeScript and integrated with the Runware API for high-quality image generation.

## 🚀 Features

- **AI Image Generation**: Generate high-quality images using advanced AI models via Runware API
- **Interactive Gallery**: Browse and view generated images in a responsive gallery layout
- **Modal Viewer**: Full-screen image viewing with detailed information
- **Modern UI**: Built with shadcn/ui components for a clean, professional interface
- **Responsive Design**: Optimized for desktop and mobile viewing
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
imageai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── runware/       # Runware API integration
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui component library
│   │   ├── ImageGenerator.tsx    # Main image generation component
│   │   ├── ImageGallery.tsx      # Image gallery display
│   │   └── ImageModal.tsx        # Image modal viewer
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Application pages
│   └── types/            # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: CSS Modules + Tailwind CSS
- **AI Service**: Runware API
- **State Management**: React Hooks
- **Type Safety**: TypeScript

## 🔧 Key Components

### ImageGenerator
The main component for generating AI images with:
- Prompt input interface
- Generation controls and settings
- Real-time generation status

### ImageGallery
Displays generated images in a responsive grid with:
- Lazy loading for performance
- Hover effects and interactions
- Click-to-view functionality

### ImageModal
Full-screen image viewer featuring:
- High-resolution image display
- Image metadata and details
- Navigation controls

## 🎨 UI Components

The application uses a comprehensive set of shadcn/ui components including:
- Form controls (buttons, inputs, checkboxes)
- Navigation (breadcrumbs, pagination, tabs)
- Feedback (alerts, toasts, skeletons)
- Layout (cards, sheets, separators)
- Advanced (carousels, drawers, calendars)

## 📱 Responsive Design

- Mobile-first approach with responsive breakpoints
- Custom hooks for mobile detection
- Optimized touch interactions
- Adaptive layouts for different screen sizes

## 🔗 API Integration

The application integrates with Runware API through:
- `/api/runware/route.ts` - Server-side API route handler
- Type-safe API responses with custom TypeScript types
- Error handling and loading states

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   # Add your Runware API key to .env.local
   RUNWARE_API_KEY=your_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 Usage

1. **Generate Images**: Enter a prompt in the ImageGenerator component
2. **View Gallery**: Browse generated images in the responsive gallery
3. **Inspect Images**: Click any image to view it in full-screen modal
4. **Navigate**: Use the built-in navigation and routing system

## 🔒 Environment Setup

Required environment variables:
- `RUNWARE_API_KEY`: Your Runware API authentication key
- `NEXT_PUBLIC_APP_URL`: Your application URL (for production)

## 📄 File Types

- **`.tsx`**: React components with TypeScript
- **`.ts`**: TypeScript utility files and type definitions
- **`.css`**: Component-specific styles and global styles
- **`.ico`**: Application favicon

## 🎨 Styling Architecture

- **Global Styles**: `globals.css` for application-wide styles
- **Component Styles**: Individual CSS files for component-specific styling
- **Utility Classes**: Tailwind CSS for rapid styling
- **Theme System**: Consistent design tokens throughout the application

## 🤝 Contributing

1. Follow the existing project structure
2. Use TypeScript for all new files
3. Implement responsive design principles
4. Add appropriate error handling
5. Include type definitions for new features

## 📈 Performance Considerations

- Lazy loading for images
- Optimized bundle splitting
- Efficient re-rendering with React hooks
- Responsive image delivery
- Caching strategies for API responses

---

**Built with ❤️ using Next.js, TypeScript, and the Runware AI API**
