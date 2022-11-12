const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { setup_channel, twittycord_key } = require('../config.json');
const axios = require('axios');
const { NearcordUsers } = require('../clients/NearcordDB');

async function checkMainChannel(client) {
  const channel = await client.channels.fetch(setup_channel);

  const messageID = await client.db.get(`setup_${setup_channel}`);
  let message = await channel.messages.fetch(messageID).catch(() => {});

  if (!messageID || !message) {
    const embed = new MessageEmbed()
      .setTitle('Follow and Earn Points')
      .setColor('#00acee')
      .setDescription(
        [
          'You can earn few points just by following user suggested by us. You will recive your reward as soon as followed user confirm that he recived your follow.',
          'In order to get someone to follow, you just need to hit that **Find Match** button and bot will send you a match for follow in your dms.',
          '*Thank you*, Have Fun!!',
        ].join('\n\n')
      )
      .setThumbnail('https://cdn-icons-png.flaticon.com/512/124/124021.png');

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('find')
        .setEmoji('🔍')
        .setStyle('SECONDARY')
        .setLabel('Find Match')
    );

    message = await channel.send({ embeds: [embed], components: [row] });
    await client.db.set(`setup_${setup_channel}`, message.id);
  }
}

async function findMatchForFollow(userId, queue, pool) {
  // Returns list of users whose discord and twitter connected
  const UsersList = await NearcordUsers.find({
<<<<<<< HEAD
    $and: [
      { 'social.discord': { $ne: null } },
      { 'social.discord': { $ne: userId } },
    ],
    'social.twitter': { $ne: null },
=======
    'social.twitter': { $ne: null },
    'social.discord': { $ne: null },
>>>>>>> afdb49a5ef806ad924f61be823d42d366ff88968
  }).toArray();

  const [oldFollowers] = await listFollowers(userId, pool);

  const users = (UsersList || []).filter((data) => {
    const twitter = data.social.twitter;
    if (
<<<<<<< HEAD
=======
      data.social.discord === userId ||
>>>>>>> afdb49a5ef806ad924f61be823d42d366ff88968
      oldFollowers.some((x) => x.target_twitter === twitter) ||
      queue.some((x) => x.target.twitter === twitter)
    ) {
      return false;
    } else {
      return true;
    }
  });

  return users[Math.floor(Math.random() * users.length)];
}

async function findTwittyUser(discordId) {
  const UserObject = await NearcordUsers.findOne({
    'social.discord': discordId,
  });
  return UserObject;
}

async function grantPoints(granter, targets, points, pool) {
  return pool.execute(
    'INSERT INTO points (type, caller_id, caller_username, to_id, to_username, points) VALUES(?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)',
    [
      'Grant',
      granter.id,
      granter.username,
      targets[0].id,
      targets[0].username,
      points,
      'Grant',
      granter.id,
      granter.username,
      targets[1].id,
      targets[1].username,
      points,
    ]
  );
}

async function addFollower(userId, userTwitter, targetId, targetTwitter, pool) {
  return pool.execute(
    'INSERT INTO followers (user, user_twitter, target, target_twitter) VALUES(?, ?, ?, ?)',
    [userId, userTwitter, targetId, targetTwitter]
  );
}

async function listFollowers(userId, pool) {
  return pool.execute('SELECT * FROM followers WHERE user=?', [userId]);
}

module.exports = {
  checkMainChannel,
  findMatchForFollow,
  findTwittyUser,
  grantPoints,
  addFollower,
  listFollowers,
};
