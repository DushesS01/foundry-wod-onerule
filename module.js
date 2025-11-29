Hooks.on("createChatMessage", async msg => {
  const r = msg.rolls?.[0];
  if (!r || !r.formula?.includes("d10")) return;

  const diffMatch = r.formula.match(/cs[>=](\d+)/);
  const diff = diffMatch ? +diffMatch[1] : 6;

  let gross = r.total || 0;
  if (!diffMatch) {
    gross = 0;
    r.dice?.forEach(die => {
      if (die.faces === 10 && die.results) {
        gross += die.results.filter(res => res.result >= diff).length;
      }
    });
  }

  let ones = 0;
  r.dice?.forEach(die => {
    if (die.faces === 10 && die.results) {
      ones += die.results.filter(res => res.result === 1).length;
    }
  });

  const net = Math.max(0, gross - ones);

  let result;
  if (net >= 5) result = `${net} ${game.i18n.localize("wod-onerule.Successes")} ${game.i18n.localize("wod-onerule.Exceptional")}`;
  else if (net > 0) result = `${net} ${game.i18n.localize("wod-onerule.Successes")}`;
  else if (ones > 0) result = game.i18n.localize("wod-onerule.Botched");
  else result = game.i18n.localize("wod-onerule.Failure");

  const newFlavor = `${msg.flavor || ""}<br><b>${game.i18n.localize("wod-onerule.Result")}:</b> ${result} (сложн. ${diff}, ${game.i18n.format("wod-onerule.MinusOnes", {count: ones})})`;
  await msg.update({ flavor: newFlavor });
});
