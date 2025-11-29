Hooks.once("init", () => {
  console.log("WoD: 1-ки отменяют + 10-ки взрываются | загружен");
});

Hooks.on("createChatMessage", async (message) => {
  const roll = message.rolls?.[0];
  if (!roll || !roll.formula?.match(/\d+d10x10cs>=\d+/)) return;

  const diff = parseInt(roll.formula.match(/cs>=(\d+)/)[1]);
  const successes = roll.total || 0;

  let ones = 0;
  roll.dice.forEach(d => {
    if (d.faces === 10 && d.results) {
      ones += d.results.filter(r => r.result === 1).length;
    }
  });

  const net = Math.max(0, successes - ones);

  let result = "";
  if (net >= 5) result = `${net} ${game.i18n.localize("wod-onerule.Successes")} ${game.i18n.localize("wod-onerule.Exceptional")}`;
  else if (net > 0) result = `${net} ${game.i18n.localize("wod-onerule.Successes")}`;
  else if (ones > 0) result = game.i18n.localize("wod-onerule.Botched");
  else result = game.i18n.localize("wod-onerule.Failure");

  const minusText = game.i18n.format("wod-onerule.MinusOnes", { count: ones });

  const newFlavor = `${message.flavor || ""}<br><b>${game.i18n.localize("wod-onerule.Result")}:</b> ${result} (сложность ${diff}, ${minusText})`;

  await message.update({ flavor: newFlavor });
});