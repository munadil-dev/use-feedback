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

  const reviews = await prisma.review.findMany({
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
      const embedReviewsDiv =
        document.getElementById("embed-reviews") ??
        document.getElementById("embed-feedbacks");

      if (!embedReviewsDiv) {
        console.error('Element with id "embed-reviews" not found.');
        return;
      }

      const reviews = ${JSON.stringify(reviews)};

      if (reviews.length === 0) {
        return;
      }

      embedReviewsDiv.setAttribute("role", "list");
      embedReviewsDiv.setAttribute("aria-label", "Customer reviews");
      embedReviewsDiv.style.display = "flex";
      embedReviewsDiv.style.gap = "16px";
      embedReviewsDiv.style.padding = "10px";
      embedReviewsDiv.style.flexWrap = "wrap";
      embedReviewsDiv.style.justifyContent = "center";
      embedReviewsDiv.style.fontFamily = "sans-serif";

      reviews.forEach(review => {
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
        starsDiv.setAttribute("role", "img");
        starsDiv.setAttribute("aria-label", "Rated " + review.rating + " out of 5");
        
        for (let i = 0; i < review.rating; i++) {
          const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          star.setAttribute("viewBox", "0 0 24 24");
          star.setAttribute("width", "20");
          star.setAttribute("height", "20");
          star.setAttribute("aria-hidden", "true");
          star.innerHTML = '<path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" fill="#ffce31"/>';
          starsDiv.appendChild(star);
        }

        // Styles
        innerDiv.style.display = "flex";
        innerDiv.style.alignItems = "center";
        innerDiv.style.gap = "10px";

        outerDiv.setAttribute("role", "listitem");
        outerDiv.style.width = "220px";
        outerDiv.style.display = "flex";
        outerDiv.style.flexDirection = "column";
        outerDiv.style.gap = "16px";
        outerDiv.style.padding = "12px";
        outerDiv.style.border = "1px solid rgba(128, 128, 128, 0.35)";
        outerDiv.style.borderRadius = "7px";

        img.alt = "";
        img.width = 35;
        img.height = 35;
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
        img.style.objectFit = "cover";
        img.style.borderRadius = "500px";
        
        nameP.style.fontWeight = 600;
        nameP.style.margin = 0;

        msgP.style.margin = 0;

        // Content
        img.src = review.customerImage || "${process.env.NEXT_PUBLIC_BASE_URL}user-icon.png";
        msgP.textContent = review.message;
        nameP.textContent = review.customerName;

        // Append Elements
        innerDiv.appendChild(img);
        innerDiv.appendChild(nameP);

        outerDiv.appendChild(innerDiv);
        outerDiv.appendChild(starsDiv);
        outerDiv.appendChild(msgP);

        embedReviewsDiv.appendChild(outerDiv);
      });
    })();
  `;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
