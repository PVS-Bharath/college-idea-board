# IdeaBoard

A mini collaborative web application where college students can share ideas, discuss them, and vote on useful concepts.

## Overview

IdeaBoard was built as a full-stack collaborative application.

Students can create accounts, publish ideas, discover ideas from other users, vote on ideas, participate in discussions, and manage their own content.

## Features

- User registration and login
- Supabase authentication
- Create ideas
- View community ideas
- Search ideas
- Filter by category
- Upvote ideas
- Comment on ideas
- Edit own ideas
- Delete own ideas
- User profile
- User-specific ownership
- Row Level Security
- Loading skeletons
- Empty states
- Error handling
- Form validation
- Responsive design

## Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security

### Deployment

- Vercel
- GitHub

## Architecture

```text
React + Vite
     |
     | Supabase JS Client
     |
     v
Supabase
     |
     +---- Authentication
     |
     +---- PostgreSQL Database
     |
     +---- Row Level Security