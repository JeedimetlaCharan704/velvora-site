// Email Service for Velvora
// To use with EmailJS, sign up at https://www.emailjs.com

// Configuration - Replace with your EmailJS credentials
const EMAIL_CONFIG = {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // Get from EmailJS Account
    serviceId: 'YOUR_SERVICE_ID',         // Get from EmailJS Email Services
    templateId: 'YOUR_TEMPLATE_ID'        // Get from EmailJS Templates
};

// Email templates (HTML versions for reference)
const EMAIL_TEMPLATES = {
    orderConfirmation: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: auto; background: #fff;">
            <div style="border-top: 6px solid #000; padding: 16px;">
                <h2>Thank You for Your Order!</h2>
            </div>
            <div style="padding: 16px;">
                <p>Dear {{customer_name}},</p>
                <p>Your order has been confirmed!</p>
                <h3>Order # {{order_id}}</h3>
                {{#orders}}
                <div style="display: flex; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <img src="{{image_url}}" style="width: 60px; height: 60px; object-fit: cover;" />
                    <div style="margin-left: 10px;">
                        <strong>{{name}}</strong>
                        <p>QTY: {{units}} | ₹{{price}}</p>
                    </div>
                </div>
                {{/orders}}
                <div style="margin-top: 20px;">
                    <p><strong>Subtotal:</strong> ₹{{subtotal}}</p>
                    <p><strong>Shipping:</strong> ₹{{shipping}}</p>
                    <p><strong>Tax:</strong> ₹{{tax}}</p>
                    <p><strong>Total:</strong> ₹{{total}}</p>
                </div>
                <div style="margin-top: 20px;">
                    <p><strong>Shipping Address:</strong></p>
                    <p>{{address}}, {{city}} - {{postal_code}}</p>
                </div>
            </div>
        </div>
    `,
    orderProcessing: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: auto; background: #fff;">
            <div style="border-top: 6px solid #000; padding: 16px;">
                <h2>Your Order is Being Processed</h2>
            </div>
            <div style="padding: 16px;">
                <p>Dear {{customer_name}},</p>
                <p>Great news! Your order is being prepared for shipment.</p>
                <h3>Order # {{order_id}}</h3>
                <p><strong>Total:</strong> ₹{{total}}</p>
                <p><strong>Items:</strong> {{items_count}}</p>
            </div>
        </div>
    `,
    orderShipped: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: auto; background: #fff;">
            <div style="border-top: 6px solid #458500; padding: 16px;">
                <h2>🎉 Your Order Has Been Shipped!</h2>
            </div>
            <div style="padding: 16px;">
                <p>Dear {{customer_name}},</p>
                <p>Your order is on its way!</p>
                <h3>Order # {{order_id}}</h3>
                <p><strong>Tracking:</strong> {{tracking_number}}</p>
                <p><strong>Courier:</strong> {{courier_name}}</p>
            </div>
        </div>
    `
};

class EmailService {
    constructor() {
        this.isConfigured = false;
    }

    init(config) {
        if (config.publicKey && config.serviceId && config.templateId) {
            EMAIL_CONFIG.publicKey = config.publicKey;
            EMAIL_CONFIG.serviceId = config.serviceId;
            EMAIL_CONFIG.templateId = config.templateId;
            this.isConfigured = true;
        }
    }

    async sendOrderConfirmation(orderData) {
        return this.sendEmail('order-confirmation', {
            customer_name: orderData.customerName,
            order_id: orderData.orderId,
            email: orderData.customerEmail,
            total: orderData.total,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            shipping: orderData.shipping || 0,
            address: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
            postal_code: orderData.shippingAddress?.postal_code || '',
            payment_method: this.getPaymentMethodName(orderData.paymentMethod),
            orders: orderData.items.map(item => ({
                name: item.name,
                units: item.quantity,
                price: item.price,
                image_url: item.image || ''
            })),
            items_count: orderData.items.length
        });
    }

    async sendOrderProcessing(orderData) {
        return this.sendEmail('order-processing', {
            customer_name: orderData.customerName,
            order_id: orderData.orderId,
            email: orderData.customerEmail,
            total: orderData.total,
            items_count: orderData.items.length,
            address: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
            postal_code: orderData.shippingAddress?.postal_code || ''
        });
    }

    async sendOrderShipped(orderData, trackingInfo) {
        return this.sendEmail('order-shipped', {
            customer_name: orderData.customerName,
            order_id: orderData.orderId,
            email: orderData.customerEmail,
            total: orderData.total,
            items_count: orderData.items.length,
            tracking_number: trackingInfo.trackingNumber || 'N/A',
            courier_name: trackingInfo.courier || 'Standard Shipping'
        });
    }

    getPaymentMethodName(method) {
        switch(method) {
            case 'qr-payment': return 'UPI QR Code';
            case 'qr-upi': return 'UPI';
            case 'cod': return 'Cash on Delivery';
            default: return 'Online Payment';
        }
    }

    async sendEmail(templateType, data) {
        // If not configured with EmailJS, save to localStorage for demo
        if (!this.isConfigured) {
            console.log('📧 Email would be sent (EmailJS not configured):', {
                template: templateType,
                to: data.email,
                data: data
            });
            
            // Store email in localStorage for demo purposes
            const emails = JSON.parse(localStorage.getItem('velvoraEmails') || '[]');
            emails.push({
                type: templateType,
                to: data.email,
                data: data,
                sentAt: new Date().toISOString()
            });
            localStorage.setItem('velvoraEmails', JSON.stringify(emails));
            
            console.log(`✅ Email saved to localStorage: ${templateType} to ${data.email}`);
            return { success: true, saved: true };
        }

        // If EmailJS is configured, send via EmailJS
        try {
            const template = EMAIL_TEMPLATES[templateType];
            if (!template) {
                throw new Error('Template not found');
            }

            // Dynamic template rendering
            let html = template;
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'string') {
                    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
                }
            }

            // Handle arrays (like orders)
            if (data.orders && Array.isArray(data.orders)) {
                const ordersHtml = data.orders.map(item => `
                    <div style="display: flex; padding: 10px 0; border-bottom: 1px solid #eee;">
                        <img src="${item.image_url}" style="width: 60px; height: 60px; object-fit: cover;" />
                        <div style="margin-left: 10px;">
                            <strong>${item.name}</strong>
                            <p>QTY: ${item.units} | ₹${item.price}</p>
                        </div>
                    </div>
                `).join('');
                html = html.replace(/{{#orders}}[\s\S]*?{{\/orders}}/g, ordersHtml);
            }

            // Use window.emailjs if available (loaded from EmailJS)
            if (window.emailjs) {
                await window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
                    ...data,
                    html: html
                });
                console.log(`✅ Email sent: ${templateType} to ${data.email}`);
                return { success: true };
            } else {
                throw new Error('EmailJS not loaded');
            }
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global email service instance
const emailService = new EmailService();

// Initialize EmailJS if script is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.emailjs) {
        emailjs.init(EMAIL_CONFIG.publicKey);
    }
});