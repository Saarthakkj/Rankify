// lib/gtag.ts
export const GA_TRACKING_ID = 'G-HW337EG7SD' // Replace with your ID

// Send pageview
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
