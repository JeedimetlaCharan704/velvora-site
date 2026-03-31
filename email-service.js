// Velvora Email Service - Using Single Dynamic Template
// Free tier compatible: 1 template for all order statuses

const EMAIL_CONFIG = {
    publicKey: 'HsWh8cFIp5_cO7qoa',
    serviceId: 'velvora-orders',
    templateId: 'template_xqnbpd9'
};

// Single dynamic email template for all order statuses
const ORDER_EMAIL_HTML = {
    // Order Placed / Confirmation
    'confirmed': `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    <div style="border-top: 6px solid #000000; padding: 16px;">
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>Thank You for Your Order!</strong>
      </span>
    </div>
    <div style="padding: 0 16px;">
      <p>Dear {{customer_name}},</p>
      <p>Your order has been confirmed! We're preparing it for shipment.</p>
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #333;">
        <strong>Order # {{order_id}}</strong>
      </div>
      <div style="padding: 16px 0;">
        <p><strong>Total:</strong> ₹{{total}}</p>
        <p><strong>Payment:</strong> {{payment_method}}</p>
      </div>
      <div style="text-align: left;">
        <p><strong>Shipping Address:</strong></p>
        <p>{{address}}, {{city}} - {{postal_code}}</p>
      </div>
    </div>
  </div>
  <div style="max-width: 600px; margin: auto;">
    <p style="color: #999;">The email was sent to {{email}}</p>
  </div>
</div>`,

    // Order Processing
    'processing': `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    <div style="border-top: 6px solid #000000; padding: 16px;">
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>Your Order is Being Processed</strong>
      </span>
    </div>
    <div style="padding: 0 16px;">
      <p>Dear {{customer_name}},</p>
      <p>Great news! Your order is being processed and will be shipped soon.</p>
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #333;">
        <strong>Order # {{order_id}}</strong>
      </div>
      <div style="padding: 16px 0; text-align: center; background: #f9f9f9; border-radius: 8px;">
        <p style="font-size: 18px; margin: 0;"><strong>Order Total: ₹{{total}}</strong></p>
      </div>
    </div>
  </div>
  <div style="max-width: 600px; margin: auto;">
    <p style="color: #999;">The email was sent to {{email}}</p>
  </div>
</div>`,

    // Order Shipped
    'shipped': `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    <div style="border-top: 6px solid #458500; padding: 16px;">
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>🎉 Your Order Has Been Shipped!</strong>
      </span>
    </div>
    <div style="padding: 0 16px;">
      <p>Dear {{customer_name}},</p>
      <p>Your order is on its way! 🎉</p>
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #333;">
        <strong>Order # {{order_id}}</strong>
      </div>
      <div style="padding: 16px 0; text-align: center; background: #f0f8f0; border-radius: 8px; border: 1px solid #458500;">
        <p><strong>Tracking Number: {{tracking_number}}</strong></p>
        <p style="color: #666;">Courier: {{courier}}</p>
      </div>
    </div>
  </div>
  <div style="max-width: 600px; margin: auto;">
    <p style="color: #999;">The email was sent to {{email}}</p>
  </div>
</div>`,

    // Order Delivered
    'delivered': `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background-color: #fff;">
    <div style="border-top: 6px solid #458500; padding: 16px;">
      <span style="font-size: 16px; vertical-align: middle; border-left: 1px solid #333; padding-left: 8px;">
        <strong>✅ Order Delivered!</strong>
      </span>
    </div>
    <div style="padding: 0 16px;">
      <p>Dear {{customer_name}},</p>
      <p>Your order has been delivered successfully! ✅</p>
      <div style="text-align: left; font-size: 14px; padding-bottom: 4px; border-bottom: 2px solid #333;">
        <strong>Order # {{order_id}}</strong>
      </div>
      <div style="padding: 16px 0;">
        <p>We hope you enjoy your purchase!</p>
        <p>Thank you for shopping with <strong>Velvora Luxury</strong></p>
      </div>
    </div>
  </div>
  <div style="max-width: 600px; margin: auto;">
    <p style="color: #999;">The email was sent to {{email}}</p>
  </div>
</div>`
};

class EmailService {
    constructor() {
        this.isConfigured = false;
        this.init(EMAIL_CONFIG);
    }

    init(config) {
        if (config.publicKey && config.serviceId && config.templateId && 
            config.publicKey !== 'YOUR_PUBLIC_KEY') {
            this.isConfigured = true;
            this.config = config;
        }
    }

    getPaymentMethodName(method) {
        switch(method) {
            case 'qr-payment': return 'UPI QR Code';
            case 'qr-upi': return 'UPI';
            case 'cod': return 'Cash on Delivery';
            default: return 'Online Payment';
        }
    }

    // Main function to send order status emails
    async sendOrderEmail(status, orderData, extraData = {}) {
        const template = ORDER_EMAIL_HTML[status];
        if (!template) {
            console.error('Invalid status:', status);
            return { success: false };
        }

        // Prepare email data
        const emailData = {
            customer_name: orderData.customerName || orderData.customer?.name || 'Customer',
            order_id: orderData.orderId || orderData.order_id || 'N/A',
            email: orderData.customerEmail || orderData.customer?.email || '',
            total: orderData.total || 0,
            payment_method: this.getPaymentMethodName(orderData.paymentMethod),
            address: orderData.shippingAddress?.address || '',
            city: orderData.shippingAddress?.city || '',
            postal_code: orderData.shippingAddress?.postal_code || '',
            ...extraData
        };

        // If EmailJS is configured
        if (this.isConfigured && window.emailjs) {
            try {
                await window.emailjs.send(this.config.serviceId, this.config.templateId, {
                    ...emailData,
                    html: template
                });
                console.log(`✅ Email sent: ${status} to ${emailData.email}`);
                return { success: true };
            } catch (e) {
                console.error('EmailJS error:', e);
            }
        }

        // Fallback: Save to localStorage for demo
        console.log(`📧 Email (${status}):`, emailData);
        const emails = JSON.parse(localStorage.getItem('velvoraEmails') || '[]');
        emails.push({
            status: status,
            to: emailData.email,
            data: emailData,
            html: template,
            sentAt: new Date().toISOString()
        });
        localStorage.setItem('velvoraEmails', JSON.stringify(emails));
        
        return { success: true, saved: true };
    }

    // Convenience methods
    async sendOrderConfirmation(orderData) {
        return this.sendOrderEmail('confirmed', orderData);
    }

    async sendOrderProcessing(orderData) {
        return this.sendOrderEmail('processing', orderData);
    }

    async sendOrderShipped(orderData, trackingInfo = {}) {
        return this.sendOrderEmail('shipped', orderData, {
            tracking_number: trackingInfo.trackingNumber || 'N/A',
            courier: trackingInfo.courier || 'Standard Shipping'
        });
    }

    async sendOrderDelivered(orderData) {
        return this.sendOrderEmail('delivered', orderData);
    }
}

// Create global instance
const emailService = new EmailService();