const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51NycusSGtdE7Lt2bwnkne1ZN7OLK9wHxVsIGy7H0rnOuoeurFNsmbCXbBr7CIZz98enNDaUrxHPHmMiYE0fRLxNf002ALi2I4m");

app.use(express.json());
app.use(cors());

// CheckOut Api

app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;
    console.log(products)

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.title,
                // images: ["http://localhost:1337"+product?.img],
            },
            unit_amount: product.price * 100,
        },
        quantity: product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/products",
        cancel_url: "http://localhost:3000/cart",
    });

    res.json({ id: session.id });
});

app.listen(7000, () => {
    console.log("server start");
});