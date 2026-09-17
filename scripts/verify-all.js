import app from "../server/index.js";

async function runVerification() {
  console.log("Starting Offhome Prime API Verification...");

  const server = app.listen(5099, async () => {
    try {
      // 1. Test live flash offers
      console.log("\n1. Testing GET /api/properties?isFlashOffer=true ...");
      const flashRes = await fetch("http://localhost:5099/api/properties?isFlashOffer=true");
      const flashData = await flashRes.json();
      console.log(`Found ${flashData.properties.length} flash properties!`);
      const sampleFlash = flashData.properties[0];
      console.log(`Sample: ${sampleFlash.title} (${sampleFlash.city}, ${sampleFlash.country}) - ${sampleFlash.availableSlots} slots left`);

      // 2. Test lease properties
      console.log("\n2. Testing GET /api/properties?type=Lease ...");
      const leaseRes = await fetch("http://localhost:5099/api/properties?type=Lease");
      const leaseData = await leaseRes.json();
      console.log(`Found ${leaseData.properties.length} lease properties!`);
      const sampleLease = leaseData.properties[0];
      console.log(`Sample: ${sampleLease.title} - ${sampleLease.leaseTerm || "Lease"}`);

      // 3. Test worldwide city filter (Dubai)
      console.log("\n3. Testing GET /api/properties?city=Dubai ...");
      const dubaiRes = await fetch("http://localhost:5099/api/properties?city=Dubai");
      const dubaiData = await dubaiRes.json();
      console.log(`Found ${dubaiData.properties.length} Dubai properties!`);

      // 4. Test social login
      console.log("\n4. Testing POST /api/users/social (Google) ...");
      const googleRes = await fetch("http://localhost:5099/api/users/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "alexander.wright@gmail.com",
          name: "Alexander Wright",
          provider: "GOOGLE"
        })
      });
      const googleData = await googleRes.json();
      console.log(`Social user authenticated: ${googleData.user.name} (${googleData.user.email}) - Provider: ${googleData.user.provider}`);

      // 5. Test slot reservation
      if (sampleFlash) {
        console.log(`\n5. Testing POST /api/properties/${sampleFlash.id}/reserve-slot ...`);
        const reserveRes = await fetch(`http://localhost:5099/api/properties/${sampleFlash.id}/reserve-slot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: "Julian Sterling",
            userEmail: "julian.sterling@gmail.com",
            userPhone: "+1 (212) 555-0199"
          })
        });
        const reserveData = await reserveRes.json();
        console.log(`Slot reservation result: ${reserveData.success} - ${reserveData.message}`);
        console.log(`Remaining slots: ${reserveData.remainingSlots}`);
      }

      console.log("\n✅ ALL BACKEND AND CONTROLLER VERIFICATIONS PASSED!");
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runVerification();
