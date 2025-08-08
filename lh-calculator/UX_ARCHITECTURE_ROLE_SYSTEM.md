# UX Architecture: Client-Side Role-Based System

## Executive Summary
Design a client-side role selection system that transforms the LH Calculator interface based on the selected role, providing different views and permissions without requiring backend authentication.

## User Experience Goals
1. **Immediate role context** - Users understand their perspective instantly
2. **Seamless switching** - Experience different roles without friction
3. **Visual consistency** - Color coding matches Excel mental model
4. **Progressive disclosure** - Show only relevant information per role
5. **Training-friendly** - Perfect for onboarding new users

## Information Architecture

### Navigation Hierarchy
```
App Header
├── Logo & App Title
├── Role Selector (Prominent)
├── Current Project Indicator
└── User Actions Menu

Main Content Area
├── Role-Specific Dashboard
├── Project Workflow View
└── Contextual Actions

Status Bar
├── Current Role Badge
├── Project Stage Indicator
└── Permissions Summary
```

## Role Selector Design

### Visual Design
```
┌────────────────────────────────────────────────────────┐
│ 🏭 LH Calculator                    [👤 Technologist ▼]│
├────────────────────────────────────────────────────────┤
│                                                         │
│  Your Role: TECHNOLOGIST                               │
│  ┌──────────────────────────────────────────────┐     │
│  │ You can edit:                                │     │
│  │ • Equipment specifications (Yellow fields)    │     │
│  │ • Technical parameters (Green fields)        │     │
│  └──────────────────────────────────────────────┘     │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### Role Selector Component
```
┌─────────────────────────┐
│ Select Your Role:       │
├─────────────────────────┤
│ 👤 Technologist        │ ← Yellow/Green fields
│ ⚙️ Design Engineer     │ ← Orange fields  
│ 📦 Supply Manager      │ ← Green fields
│ 👔 General Director    │ ← Red fields + all view
│ 👁️ Viewer             │ ← Read-only access
└─────────────────────────┘
```

### Role Switching Flow
1. User clicks role selector
2. Dropdown appears with role options
3. Selection triggers immediate UI transformation
4. Toast notification confirms role change
5. Interface updates to show role-specific view

## Project-Centric Dashboard

### Technologist View
```
┌──────────────────────────────────────────────────────────┐
│ TECHNOLOGIST WORKSPACE                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Current Project: HE-2024-001                            │
│ Your Tasks: Technical Specification                      │
│                                                          │
│ ┌────────────────────────────────────────────────┐      │
│ │ 📋 Technical Specification Form                │      │
│ │                                                │      │
│ │ Equipment Configuration (Yellow)               │      │
│ │ [Dropdown] Equipment Type: K4-750             │      │
│ │ [Dropdown] Plate Material: AISI 316L          │      │
│ │                                                │      │
│ │ Operating Parameters (Green)                   │      │
│ │ [Input] Plate Count: 400                      │      │
│ │ [Input] Pressure A: 22 bar                    │      │
│ │ [Input] Temperature A: 100°C                  │      │
│ │                                                │      │
│ │ [Save Draft] [Submit for Engineering]          │      │
│ └────────────────────────────────────────────────┘      │
│                                                          │
│ Other Sections (Locked):                                │
│ 🔒 Engineering Design - Awaiting your submission        │
│ 🔒 Procurement - Requires engineering completion        │
│ 🔒 Executive Review - Final stage                       │
└──────────────────────────────────────────────────────────┘
```

### Design Engineer View
```
┌──────────────────────────────────────────────────────────┐
│ DESIGN ENGINEER WORKSPACE                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Current Project: HE-2024-001                            │
│ Your Tasks: Engineering Specifications                   │
│                                                          │
│ ✅ Technical Specification (View Only)                   │
│ ┌────────────────────────────────────────────────┐      │
│ │ Equipment: K4-750, 400 plates, AISI 316L      │      │
│ │ Operating: 22 bar, 100°C                      │      │
│ └────────────────────────────────────────────────┘      │
│                                                          │
│ 📝 Engineering Design (Orange)                          │
│ ┌────────────────────────────────────────────────┐      │
│ │ Connection Design                              │      │
│ │ [Dropdown] Hot Flange: Ру10 / Ду600          │      │
│ │ [Dropdown] Cold Flange: Ру25 / Ду450         │      │
│ │                                                │      │
│ │ Fastener Specifications                        │      │
│ │ [Input] Bolt Type: M16                        │      │
│ │ [Input] Bolt Quantity: 24                     │      │
│ │                                                │      │
│ │ [Save Draft] [Submit for Procurement]          │      │
│ └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### General Director View
```
┌──────────────────────────────────────────────────────────┐
│ EXECUTIVE DASHBOARD                                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Project Overview: HE-2024-001                           │
│                                                          │
│ ┌─────────┬─────────┬─────────┬─────────┐              │
│ │Technical│Engineer │Procure  │Executive│              │
│ │   ✅    │   ✅    │   ✅    │   🔄    │              │
│ └─────────┴─────────┴─────────┴─────────┘              │
│                                                          │
│ Calculated Base Cost: ₽1,356,336.64                     │
│                                                          │
│ Executive Controls (Red)                                │
│ ┌────────────────────────────────────────────────┐      │
│ │ Management Adjustments                        │      │
│ │ [Input] Management Coefficient: 1.15          │      │
│ │ [Input] Director's Reserve: ₽50,000          │      │
│ │                                                │      │
│ │ Final Cost: ₽1,609,737.14                     │      │
│ │                                                │      │
│ │ [Request Changes] [Approve Project]            │      │
│ └────────────────────────────────────────────────┘      │
│                                                          │
│ 📊 View All Stages (Expanded Access)                    │
└──────────────────────────────────────────────────────────┘
```

## Interaction Patterns

### Field-Level Interactions

#### Editable Field (Matches User Role)
```
┌─────────────────────────────────┐
│ Plate Count                     │ ← Label
│ ┌───────────────────────────┐   │
│ │ 400                       │   │ ← Editable input
│ └───────────────────────────┘   │
│ ✓ You can edit this field       │ ← Permission indicator
└─────────────────────────────────┘
```

#### Locked Field (Different Role)
```
┌─────────────────────────────────┐
│ Management Coefficient 🔒        │ ← Lock icon
│ ┌───────────────────────────┐   │
│ │ 1.15                      │   │ ← Read-only, grayed
│ └───────────────────────────┘   │
│ ⚠️ Director access required      │ ← Role requirement
└─────────────────────────────────┘
```

#### Calculated Field (System)
```
┌─────────────────────────────────┐
│ Test Pressure (Calculated) 🔢    │ ← Calculator icon
│ ┌───────────────────────────┐   │
│ │ 31.46 bar                 │   │ ← Auto-calculated
│ └───────────────────────────┘   │
│ ℹ️ Auto-calculated value         │ ← System indicator
└─────────────────────────────────┘
```

## Visual Design System

### Color Palette
```css
/* Role Colors - Match Excel */
--color-technologist: #FFFF00;    /* Yellow */
--color-engineer: #FFC000;         /* Orange */
--color-supply: #92D050;           /* Green */
--color-director: #FF0000;         /* Red */
--color-calculated: #E0E0E0;       /* Gray */

/* UI State Colors */
--color-editable: #4CAF50;         /* Can edit indicator */
--color-locked: #9E9E9E;           /* Cannot edit */
--color-pending: #FF9800;          /* Awaiting input */
--color-complete: #2196F3;         /* Stage complete */
```

### Typography Hierarchy
```
Role Badge: 14px bold uppercase
Section Title: 18px semi-bold
Field Label: 14px medium
Field Value: 16px regular
Helper Text: 12px regular
Permission Text: 11px regular italic
```

### Spacing System
```
Section padding: 24px
Field group spacing: 16px
Field internal padding: 12px
Label to input: 8px
Helper text margin: 4px
```

## Responsive Behavior

### Desktop (>1200px)
- Full project dashboard with all sections visible
- Role selector in header
- Side-by-side form layout
- Workflow progress bar horizontal

### Tablet (768px - 1200px)
- Collapsible sections
- Role selector remains in header
- Single column form layout
- Workflow progress bar horizontal

### Mobile (<768px)
- Role selector in hamburger menu
- Accordion-style sections
- Single field per row
- Workflow progress dots instead of bar
- Swipe between workflow stages

## State Management

### Local Storage Structure
```javascript
{
  "lh-calculator-role": "technologist",
  "lh-calculator-preferences": {
    "showPermissionHints": true,
    "autoSaveDrafts": true,
    "colorBlindMode": false
  },
  "lh-calculator-drafts": {
    "HE-2024-001": {
      "technical": { /* draft data */ },
      "lastModified": "2024-01-08T10:30:00Z"
    }
  }
}
```

### Role Switch Animation
1. Fade out current content (200ms)
2. Show role transition indicator
3. Update UI components for new role
4. Fade in new content (200ms)
5. Show success toast (3s)

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Arrow keys for dropdown navigation
- Enter to submit forms
- Escape to close modals
- Shift+R for role selector focus

### Screen Reader Support
```html
<div role="main" aria-label="Technologist Workspace">
  <h1>Technical Specification Form</h1>
  <div role="region" aria-label="Equipment Configuration">
    <label for="equipment-type">
      Equipment Type
      <span aria-label="Yellow field - Technologist access">
        (Your field)
      </span>
    </label>
  </div>
</div>
```

### Visual Accessibility
- High contrast mode support
- Color-blind friendly indicators (icons + patterns)
- Focus indicators (3px outline)
- Minimum touch target 44x44px
- Text remains readable at 200% zoom

## User Onboarding Flow

### First-Time User
```
1. Welcome Modal
   "Welcome to LH Calculator! Let's set up your workspace."
   
2. Role Selection
   "What's your role in the heat exchanger calculation process?"
   [Show role options with descriptions]
   
3. Role Explanation
   "As a [Role], you can edit [color] fields and are responsible for [tasks]"
   
4. Interactive Tutorial
   Highlight editable fields with pulsing animation
   Show locked fields with explanation
   
5. Ready to Start
   "You're all set! Start with your first project."
```

### Role Switch Tutorial
```
When user first switches roles:
1. "You've switched to [New Role]"
2. "Your permissions have changed:"
   - ✅ Can now edit: [orange fields]
   - 🔒 No longer edit: [yellow fields]
3. "Your workspace has been updated"
```

## Performance Considerations

### Instant Role Switching
- All role views pre-rendered but hidden
- CSS classes toggle visibility
- No network requests required
- Animation frame-based transitions
- Debounced local storage saves

### Memory Optimization
- Lazy load role-specific components
- Virtual scrolling for long forms
- Memoized permission calculations
- Efficient re-renders with React.memo

## Success Metrics

### User Experience KPIs
- Role switch time: <300ms
- Time to find correct field: <5s
- Error rate per role: <5%
- Training time reduction: 50%
- User satisfaction: >4.5/5

### Technical KPIs
- First contentful paint: <1s
- Time to interactive: <2s
- Lighthouse score: >90
- Bundle size: <500KB
- Memory usage: <50MB

## Implementation Priorities

### Phase 1: MVP (Week 1)
1. Role selector in navigation
2. Basic field color coding
3. Permission indicators
4. Local storage persistence

### Phase 2: Enhanced (Week 2)
1. Project dashboard per role
2. Workflow stage visualization
3. Animated transitions
4. Onboarding flow

### Phase 3: Polish (Week 3)
1. Accessibility features
2. Mobile optimization
3. Performance tuning
4. User preferences

## Design Handoff Checklist

- [ ] Figma mockups for each role view
- [ ] Color system documentation
- [ ] Component specifications
- [ ] Interaction animations
- [ ] Responsive breakpoints
- [ ] Accessibility requirements
- [ ] Icon set (role badges)
- [ ] Success/error states
- [ ] Loading states
- [ ] Empty states

## Conclusion

This UX architecture provides a comprehensive client-side role system that:
1. Requires no backend changes
2. Provides immediate value for training
3. Respects the Excel color-coding mental model
4. Creates foundation for future authentication
5. Delivers professional, intuitive experience

The design prioritizes clarity, efficiency, and user empowerment while maintaining the business logic from the Excel-based system.