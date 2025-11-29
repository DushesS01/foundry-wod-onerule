Hooks.on("createChatMessage", async msg => {
  const r = msg.rolls?.[0];
  if (!r?.formula?.match(/\d+d10x10cs>=\d+/)) return;

  const diff = + (r.formula.match(/cs>=(\d+)/)[1]);
  const gross = r.total || 0;

  const ones = r.dice.reduce((acc, die) => 
    die.faces === 10 ? acc + die.results.filter(d => d.result === 1).length : acc, 0);

  const net = Math.max(0, gross - ones);

  const txt = net >= 5 ? `${net} успех(ов) (ИСКЛЮЧИТЕЛЬНЫЙ!)`
            : net > 0  ? `${net} успех(ов)`
            : ones > 0 ? "БОТЧ!"
            : "Провал";

  const newFlavor = `${msg.flavor || ""}<br>Чистый результат: <b>${txt}</b> (сложность ${diff}, −${ones} единиц)`;
  await msg.update({ flavor: newFlavor });
});
