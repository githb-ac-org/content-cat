import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function AppleIcon() {
  const unboundedFont = await fetch(
    "https://fonts.gstatic.com/s/unbounded/v12/Yq6F-LOTXCb04q32xlpat-6uR42XTqtG68b2040.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
          borderRadius: "32px",
        }}
      >
        <span
          style={{
            fontFamily: "Unbounded",
            fontSize: "110px",
            fontWeight: 600,
            color: "white",
          }}
        >
          C
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Unbounded",
          data: unboundedFont,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
