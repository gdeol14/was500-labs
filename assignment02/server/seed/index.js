require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const NPC = require('../models/NPC');
const Quest = require('../models/Quest');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await NPC.deleteMany({});
    await Quest.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedPassword1 = await bcrypt.hash('Gurman29', 10);
    const hashedPassword2 = await bcrypt.hash('Gurman2930', 10);
    
    const users = await User.insertMany([
      {
        email: 'gurman@gmail.com',
        password: hashedPassword1,
        username: 'Gurman',
        role: 'admin'
      },
      {
        email: 'gurmandeep@gmail.com',
        password: hashedPassword2,
        username: 'Gurmandeep',
        role: 'user'
      }
    ]);
    console.log('Created users');

    // Create NPCs
    const npcs = await NPC.insertMany([
      {
        name: 'Elara Moonwhisper',
        race: 'Elf',
        class: 'Wizard',
        alignment: 'Neutral Good',
        level: 12,
        location: 'Tower of Arcane Studies',
        notes: 'Renowned scholar of ancient magic. Seeks adventurers to recover lost artifacts.',
        createdBy: users[0]._id
      },
      {
        name: 'Thorin Ironforge',
        race: 'Dwarf',
        class: 'Fighter',
        alignment: 'Lawful Good',
        level: 10,
        location: 'Ironforge Tavern',
        notes: 'Veteran warrior and blacksmith. Can craft magical weapons for worthy heroes.',
        createdBy: users[0]._id
      },
      {
        name: 'Shadowblade',
        race: 'Half-Elf',
        class: 'Rogue',
        alignment: 'Chaotic Neutral',
        level: 8,
        location: 'Thieves Guild',
        notes: 'Master thief with connections to the underground. Information broker.',
        createdBy: users[0]._id
      },
      {
        name: 'Brother Marcus',
        race: 'Human',
        class: 'Cleric',
        alignment: 'Lawful Good',
        level: 9,
        location: 'Temple of Light',
        notes: 'Devoted healer who tends to the sick and wounded. Seeks to root out undead.',
        createdBy: users[0]._id
      },
      {
        name: 'Grimnar the Red',
        race: 'Half-Orc',
        class: 'Barbarian',
        alignment: 'Chaotic Neutral',
        level: 11,
        location: 'Northern Wastes',
        notes: 'Tribal chieftain who values strength above all. Can be reasoned with.',
        createdBy: users[1]._id
      },
      {
        name: 'Lady Celestia',
        race: 'Human',
        class: 'Noble',
        alignment: 'Lawful Neutral',
        level: 5,
        location: 'Castle Highgarden',
        notes: 'Wealthy noblewoman with political influence. Hires adventurers for delicate matters.',
        createdBy: users[0]._id
      }
    ]);
    console.log('Created NPCs');

    // Create Quests
    await Quest.insertMany([
      {
        title: 'The Lost Artifact of Azura',
        description: 'Elara Moonwhisper has discovered the location of an ancient artifact hidden in the Sunken Temple. Retrieve it before the cult of shadows finds it first.',
        difficulty: 'Hard',
        status: 'Not Started',
        reward: '500 gold pieces and a magical scroll',
        npcs: [npcs[0]._id],
        location: 'Sunken Temple',
        notes: 'Temple is underwater. Prepare water breathing spells or potions.',
        createdBy: users[0]._id
      },
      {
        title: 'Forge the Legendary Blade',
        description: 'Thorin Ironforge needs rare materials to craft a legendary weapon. Gather dragon scales, mithril ore, and phoenix feathers.',
        difficulty: 'Deadly',
        status: 'In Progress',
        reward: 'Legendary weapon of your choice',
        npcs: [npcs[1]._id],
        location: 'Various locations',
        notes: 'Dragon scales from Crimson Peak, mithril from Deep Mines, phoenix in Fire Mountains.',
        createdBy: users[0]._id
      },
      {
        title: 'Investigate the Thieves Guild',
        description: 'A series of high-profile thefts have plagued the city. Infiltrate the Thieves Guild and discover who is behind the organized crime wave.',
        difficulty: 'Medium',
        status: 'Not Started',
        reward: '300 gold pieces and city favor',
        npcs: [npcs[2]._id],
        location: 'City Underworks',
        notes: 'Stealth and diplomacy will be more useful than combat.',
        createdBy: users[0]._id
      },
      {
        title: 'Purge the Undead Catacombs',
        description: 'Brother Marcus reports that undead have risen in the old catacombs beneath the city. Clear them out and discover the source of the necromancy.',
        difficulty: 'Medium',
        status: 'Completed',
        reward: 'Blessing of the Light and 400 gold',
        npcs: [npcs[3]._id],
        location: 'Catacombs beneath Temple District',
        notes: 'Holy water and radiant damage are effective against undead.',
        createdBy: users[0]._id
      },
      {
        title: 'Negotiate Peace with the Tribes',
        description: 'Grimnar the Red leads raids on settlements. Either defeat him in single combat or negotiate a peace treaty between the tribes and the kingdom.',
        difficulty: 'Hard',
        status: 'In Progress',
        reward: 'Land grant or magical item from tribal treasury',
        npcs: [npcs[4]._id],
        location: 'Northern Wastes',
        notes: 'Strength and honor are valued. Showing respect is crucial.',
        createdBy: users[1]._id
      },
      {
        title: 'The Masquerade Ball Mystery',
        description: 'Lady Celestia is hosting a masquerade ball, but she suspects an assassination attempt. Protect her and uncover the conspiracy.',
        difficulty: 'Easy',
        status: 'Not Started',
        reward: '250 gold and noble connections',
        npcs: [npcs[5]._id],
        location: 'Castle Highgarden',
        notes: 'Formal attire required. Investigation and social skills needed.',
        createdBy: users[0]._id
      }
    ]);
    console.log('Created quests');

    console.log('\nDatabase seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Email: gurman@gmail.com, Password: Gurman29');
    console.log('Email: gurmandeep@gmail.com, Password: Gurman2930');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();