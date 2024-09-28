import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required", success: false },
      { status: 400 }
    );
  }

  const feedbacks = await prisma.feedback.findMany({
    where: {
      productId,
      isFavorite: true,
    },
    select: {
      message: true,
      customerName: true,
      customerImage: true,
      rating: true,
    },
  });

  const script = `
    ;(function() {
      const embedFeedbacksDiv = document.getElementById("embed-feedbacks");

      if (!embedFeedbacksDiv) {
        console.error('Element with id "embed-feedbacks" not found.');
        return;
      }

      embedFeedbacksDiv.style.display = "flex";
      embedFeedbacksDiv.style.gap = "16px";
      embedFeedbacksDiv.style.padding = "10px";
      embedFeedbacksDiv.style.flexWrap = "wrap";
      embedFeedbacksDiv.style.justifyContent = "center";
      embedFeedbacksDiv.style.fontFamily = "sans-serif";
      
      const feedbacks = ${JSON.stringify(feedbacks)};
      
      feedbacks.forEach(feedback => {
        // Create Elements
        const msgP = document.createElement("p");
        const nameP = document.createElement("p");
        const img = document.createElement("img");
        const outerDiv = document.createElement("div");
        const innerDiv = document.createElement("div");
        
        // Star Rating
        const starsDiv = document.createElement("div");
        starsDiv.style.display = "flex";
        starsDiv.style.gap = "2px";
        
        for (let i = 0; i < feedback.rating; i++) {
          const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          star.setAttribute("viewBox", "0 0 24 24");
          star.setAttribute("width", "20");
          star.setAttribute("height", "20");
          star.innerHTML = '<path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" fill="#ffce31"/>';
          starsDiv.appendChild(star);
        }

        // Styles
        innerDiv.style.display = "flex";
        innerDiv.style.alignItems = "center";
        innerDiv.style.gap = "10px";

        outerDiv.style.width = "220px";
        outerDiv.style.display = "flex";
        outerDiv.style.flexDirection = "column";
        outerDiv.style.gap = "16px";
        outerDiv.style.padding = "12px";
        outerDiv.style.border = "1px solid rgb(215, 215, 215)";
        outerDiv.style.borderRadius = "7px";

        img.style.width = "35px";
        img.style.height = "35px";
        img.style.borderRadius = "500px";
        
        nameP.style.fontWeight = 600;
        nameP.style.margin = 0;

        msgP.style.margin = 0;

        // Content
        img.src = feedback.customerImage;
        msgP.textContent = feedback.message;
        nameP.textContent = feedback.customerName;

        // Append Elements
        innerDiv.appendChild(img);
        innerDiv.appendChild(nameP);

        outerDiv.appendChild(innerDiv);
        outerDiv.appendChild(starsDiv);
        outerDiv.appendChild(msgP);

        embedFeedbacksDiv.appendChild(outerDiv);
      });
    })();
  `;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
