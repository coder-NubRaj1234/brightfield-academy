# Brightfield Academy School Website

## Current State
New project. Empty Motoko backend actor. No frontend pages exist.

## Requested Changes (Diff)

### Add
- Full responsive single-page school website
- Navigation bar with hamburger menu for mobile
- Hero section with school name, tagline, background image, CTA
- Notice board section with scrolling/card notices
- About section with school introduction
- Teachers section: 20+ teacher cards in grid with modal popup on click
- Results section: search form (name, class, section) showing dynamic marksheet
- Contact section with validated form
- Footer with address, social links, copyright
- All sample data (teachers, results, notices) stored as JS objects in frontend

### Modify
- Backend actor: add minimal stubs if needed (can remain mostly empty)

### Remove
- Nothing (new project)

## Implementation Plan
1. Write all sample data (20+ teachers, notices, student results) as frontend TypeScript constants
2. Build App.tsx as single-page with all sections
3. Implement NavBar with scroll-spy and mobile hamburger
4. Hero section with animated text and CTA
5. Notice board with animated scrolling ticker + card list
6. About section two-column layout
7. Teachers grid with modal popup showing full teacher details
8. Results search form with dynamic marksheet rendering
9. Contact form with validation
10. Footer
11. CSS animations: hover effects, smooth scroll, modal transitions, loading states
