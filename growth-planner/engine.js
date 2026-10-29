// The Growth Planner projection, as the app works it out. It follows the app's calculation
// conventions (docs/calculation-conventions.md in the app's repository): monthly steps,
// effective annual rates, the return before the fee each month, and inflation only in the
// today's-money figure. The app uses exact decimals; this uses ordinary numbers, so a result
// can differ from the app's by a fraction of a penny, and very rarely by 1 once rounded.
//
// Rates are fractions (0.05 is 5%). Frequency is 1, 3 or 12 months; timing is "start" or "end".
(function (root) {
  function project(input) {
    var months = input.durationMonths;
    var period = input.frequencyMonths || 1;
    var growth = Math.pow(1 + input.annualReturn, 1 / 12) - 1;
    var fee = 1 - Math.pow(1 - (input.annualFee || 0), 1 / 12);
    var increase = input.annualIncrease || 0;
    var inflation = input.annualInflation || 0;
    var start = input.timing === "start";

    var balance = input.initialBalance;
    var paidIn = 0;
    var fees = 0;
    var yearEnds = [];
    var points = [{ month: 0, balance: balance, paidIn: input.initialBalance, real: balance }];

    function contribution(month) {
      var year = Math.floor((month - 1) / 12) + 1;
      return input.contribution * Math.pow(1 + increase, year - 1);
    }

    for (var month = 1; month <= months; month++) {
      if (start && (month - 1) % period === 0) {
        var paid = contribution(month);
        balance += paid;
        paidIn += paid;
      }
      balance += balance * growth;
      var charged = balance * fee;
      balance -= charged;
      fees += charged;
      if (!start && month % period === 0) {
        var paidAtEnd = contribution(month);
        balance += paidAtEnd;
        paidIn += paidAtEnd;
      }
      var real = balance / Math.pow(1 + inflation, month / 12);
      if (month % 12 === 0 || month === months) {
        yearEnds.push(balance);
        points.push({ month: month, balance: balance, paidIn: input.initialBalance + paidIn, real: real });
      }
    }

    var finalReal = balance / Math.pow(1 + inflation, months / 12);
    return {
      finalBalance: balance,
      finalRealBalance: finalReal,
      totalContributions: paidIn,
      totalFees: fees,
      yearEndBalances: yearEnds,
      points: points,
    };
  }

  root.GrowthEngine = { project: project };
})(typeof window !== "undefined" ? window : this);
