# App Review notes: Pikup Chef

Paste the "Notes for the reviewer" section into App Store Connect → App Review Information.

## Before submitting
- [ ] Create a demo vendor account on production and approve it in the admin dashboard (Vendors → Verification).
- [ ] Give it 2–3 menu items with photos and at least one extra.
- [ ] Place one test order to it so the Orders screen isn't empty.
- [ ] Fill in the credentials below. Don't commit real passwords to git.
- [ ] Confirm `ios.bundleIdentifier` (`com.pikuphq.pikupchef`) matches the App ID in App Store Connect.

## Notes for the reviewer
Pikup Chef is the restaurant-side app for Pikup, a food delivery service in Nigeria. Restaurants use it to manage their menu, accept and prepare orders, and withdraw their earnings.

Demo account (already approved by our team):
- Email: `<demo vendor email>`
- Password: `<demo vendor password>`

Things to try:
1. **Home**: incoming orders. Open one and move it through Accept → Ready for pickup.
2. **Menu**: add a menu item with a photo, or add an extra (e.g. "Extra chicken").
3. **Wallet**: balance and history. Withdrawals need a Nigerian bank account, so please don't submit one.
4. **Profile → Delete my account**: in-app account deletion (asks for the password).

New restaurants that sign up see a "Waiting for verification" banner until our team approves them. Customers can't see a restaurant before approval.

Permissions: notifications (new-order alerts with a sound) and the photo library (menu and restaurant photos). The app doesn't use the camera, microphone or location.

Payments: customers pay in the Pikup customer app. This app only shows earnings and sends payouts to the restaurant's bank account through Paystack. There's no in-app purchase of digital goods.
