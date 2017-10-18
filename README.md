# Classical Arcade Game
===============================

## Table of Contents
- Overview  
- Functions
- Dependencies
- Resources
- What have I learned?

## Overview

![](/capture1.PNG)

- This is part of Udacity's FEWD-ND (Front End Web Developer Nanodegree) 's assignments.
- This is a simple classical arcade game.
- Player has to collect stars by reaching to the water zone.
- Player can collect items.
- Player loses HP when touched by enemy bugs.

## Functions

- User can choose a character out of 5 choices before the game begins.
- Enemy bugs are spawned every certain period of time with random speed.
- Random items out of 4 choices total are dropped on a random location every certain period of time.
- User can move around the map, but user can't go outside of the map.
- User gets additional score when reaching to the water zone or items.
- This game is finished when 5 stars are collected.

## Dependencies

- There is no extra dependencies. (pure javascript)

## Resources

- index.html
  - only to link javascript files to the page.
- /css
  - only text-alignment style exists.
- /images
  - image resources
- /js
  - /resources.js: image resource management purpose.
  - /engine.js: gives a frame of the game. canvas object is in here, and background images are drawn here.
  - /app.js: main logic for the game.

## What have I learned?

- Pseudoclassical pattern to define javascript class.
- OOP in javascript.
- Collision detection.
- Javascript timer function.
- Manipulation array, dictionary, and objects.
- Key press event listener.
- Draw images and text using Canvas object.
