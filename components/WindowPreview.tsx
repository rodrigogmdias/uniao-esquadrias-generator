import React, { useMemo } from 'react';
import { WindowConfig, WindowType } from '../types';
import { FINISH_COLORS_MAP, GLASS_COLORS } from '../constants';

interface WindowPreviewProps {
  config: WindowConfig;
}

const WindowPreview: React.FC<WindowPreviewProps> = ({ config }) => {
  const { width, height, finish, accessoryColor, type, hasContramarco, hasPersiana, glassType, productLine } = config;

  // Fallback if finish is somehow not in map (though inputs are controlled)
  const colors = FINISH_COLORS_MAP[finish] || FINISH_COLORS_MAP["Branco Brilhante RAL9003"];
  const glassColor = GLASS_COLORS[glassType];
  const accFill = accessoryColor === 'Preto' ? '#1A1A1A' : '#FFFFFF';
  const accStroke = accessoryColor === 'Preto' ? 'none' : '#999999';

  // SVG Configuration
  const padding = 100; // Padding around the drawing for dimensions
  // Viewbox needs to encompass the window + dimensions + contramarco
  const viewBoxWidth = width + (padding * 2);
  const viewBoxHeight = height + (padding * 2);

  // Profile dimensions 
  // Linha Gold is significantly more robust than Suprema
  const frameThick = productLine === 'Gold' ? 70 : 50;
  const sashThick = productLine === 'Gold' ? 55 : 45;
  const persianaHeight = 200;

  // Real drawing dimensions
  const drawX = padding;
  const drawY = padding;
  
  // If persiana is enabled, the glass area starts below the persiana box
  const actualFrameHeight = hasPersiana ? height - persianaHeight : height;
  const frameY = hasPersiana ? drawY + persianaHeight : drawY;

  // Helper to render direction arrow
  const renderArrow = (cx: number, cy: number, direction: 'left' | 'right' | 'down') => {
    let rotation = 0;
    if (direction === 'left') rotation = 180;
    if (direction === 'down') rotation = 90;

    return (
      <g transform={`translate(${cx}, ${cy})`} className="drop-shadow-sm">
        <circle r="18" fill="rgba(255,255,255,0.85)" stroke="#e5e7eb" strokeWidth="1" />
        <g transform={`rotate(${rotation})`}>
             <path 
                d="M-5 0 H5 M2 -4 L6 0 L2 4" 
                stroke="#1f2937" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
                transform="scale(1.2)"
             />
        </g>
      </g>
    );
  };

  // Dimension Arrows Helper
  const renderDimension = (val: number, isVertical: boolean) => {
    const textOffset = 40;
    const tickSize = 10;
    
    if (isVertical) {
      const x = drawX - textOffset;
      const startY = drawY;
      const endY = drawY + height;
      const midY = startY + (height / 2);
      
      return (
        <g stroke="#666" fill="#666">
          <line x1={x} y1={startY} x2={x} y2={endY} strokeWidth="2" />
          <line x1={x - tickSize} y1={startY} x2={x + tickSize} y2={startY} strokeWidth="2" />
          <line x1={x - tickSize} y1={endY} x2={x + tickSize} y2={endY} strokeWidth="2" />
          <text x={x - 10} y={midY} textAnchor="end" alignmentBaseline="middle" className="text-sm font-sans font-bold">
            {val}mm
          </text>
        </g>
      );
    } else {
      const y = drawY + height + textOffset;
      const startX = drawX;
      const endX = drawX + width;
      const midX = startX + (width / 2);

      return (
        <g stroke="#666" fill="#666">
          <line x1={startX} y1={y} x2={endX} y2={y} strokeWidth="2" />
          <line x1={startX} y1={y - tickSize} x2={startX} y2={y + tickSize} strokeWidth="2" />
          <line x1={endX} y1={y - tickSize} x2={endX} y2={y + tickSize} strokeWidth="2" />
          <text x={midX} y={y + 20} textAnchor="middle" alignmentBaseline="hanging" className="text-sm font-sans font-bold">
            {val}mm
          </text>
        </g>
      );
    }
  };

  const renderSashes = () => {
    if (type === WindowType.MAXIM_AR) {
      // Single pane that opens outwards (visualized as a simple frame with a handle/icon)
      const sashWidth = width - (frameThick * 2);
      const sashHeight = actualFrameHeight - (frameThick * 2);
      return (
        <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
          <rect
            width={sashWidth}
            height={sashHeight}
            fill={glassColor}
            stroke={colors.stroke}
            strokeWidth="4"
          />
           {/* Inner sash frame */}
           <rect
            x={0} y={0}
            width={sashWidth}
            height={sashHeight}
            fill="none"
            stroke={colors.fill}
            strokeWidth={sashThick} /* Sash profile width */
          />
           {/* Maxim-ar dashed lines indicating opening */}
           <polyline 
             points={`0,${sashHeight} ${sashWidth/2},0 ${sashWidth},${sashHeight}`} 
             fill="none" 
             stroke="#999" 
             strokeWidth="2" 
             strokeDasharray="15,10"
             opacity="0.7"
           />
           {/* Handle */}
           <circle cx={sashWidth/2} cy={sashHeight - 20} r="6" fill={accFill} stroke={accStroke} strokeWidth="1" />
           
           {/* Direction Arrow */}
           {renderArrow(sashWidth / 2, sashHeight / 2, 'down')}
        </g>
      );
    }

    if (type === WindowType.SLIDING_2_LEAF) {
      const overlap = 20;
      const leafWidth = (width - (frameThick * 2)) / 2 + overlap;
      const leafHeight = actualFrameHeight - (frameThick * 2);

      // Left Leaf (Back)
      const leftLeaf = (
        <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
          <rect width={leafWidth} height={leafHeight} fill={glassColor} stroke={colors.stroke} strokeWidth="1" />
           {/* Sash Frame */}
           <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={sashThick} />
           {/* Glass Glint */}
           <path d={`M${leafWidth * 0.2},${leafHeight * 0.2} L${leafWidth * 0.8},${leafHeight * 0.8}`} stroke="white" strokeWidth="2" opacity="0.3" />
           
           {/* Direction Arrow (Slides Right to open) */}
           {renderArrow(leafWidth / 2, leafHeight / 2, 'right')}
        </g>
      );

      // Right Leaf (Front)
      const rightLeaf = (
        <g transform={`translate(${drawX + frameThick + leafWidth - (overlap * 2)}, ${frameY + frameThick})`}>
          {/* Shadow for depth */}
          <rect x="-5" y="0" width={leafWidth} height={leafHeight} fill="black" opacity="0.1" />
          
          <rect width={leafWidth} height={leafHeight} fill={glassColor} stroke={colors.stroke} strokeWidth="1" />
           {/* Sash Frame */}
           <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={sashThick} />
           {/* Lock Handle approximation */}
           <rect x={10} y={leafHeight/2 - 20} width={8} height={40} rx="4" fill={accFill} stroke={accStroke} strokeWidth="1" />

           {/* Direction Arrow (Slides Left to open) */}
           {renderArrow(leafWidth / 2, leafHeight / 2, 'left')}
        </g>
      );

      return (
        <>
          {leftLeaf}
          {rightLeaf}
        </>
      );
    }

    if (type === WindowType.SLIDING_4_LEAF) {
        // Simplified 4 leaf logic
        const overlap = 20;
        const totalInteriorWidth = width - (frameThick * 2);
        const leafWidth = (totalInteriorWidth / 4) + overlap;
        const leafHeight = actualFrameHeight - (frameThick * 2);
        
        // Just rendering 4 rectangles for simplicity
        return Array.from({length: 4}).map((_, i) => {
             const xPos = drawX + frameThick + (i * (leafWidth - overlap));
             const isCenter = i === 1 || i === 2;
             
             // Leaf 0: Fixed Left (no arrow)
             // Leaf 1: Slides Left (Arrow Left)
             // Leaf 2: Slides Right (Arrow Right)
             // Leaf 3: Fixed Right (no arrow)

             return (
                <g key={i} transform={`translate(${xPos}, ${frameY + frameThick})`}>
                    <rect width={leafWidth} height={leafHeight} fill={glassColor} stroke={colors.stroke} strokeWidth="1" />
                    <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={sashThick} />
                    {isCenter && (
                        <rect x={10} y={leafHeight/2 - 20} width={8} height={40} rx="4" fill={accFill} stroke={accStroke} strokeWidth="1" />
                    )}
                    
                    {i === 1 && renderArrow(leafWidth / 2, leafHeight / 2, 'left')}
                    {i === 2 && renderArrow(leafWidth / 2, leafHeight / 2, 'right')}
                </g>
             )
        });
    }

    return null;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-inner border border-gray-200 p-4 overflow-hidden">
      <svg
        viewBox={`-${padding/2} -${padding/2} ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full max-h-[600px] object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" style={{stroke:'#333', strokeWidth:1}} />
            </pattern>
        </defs>

        {/* Contramarco (dashed outline) */}
        {hasContramarco && (
          <rect
            x={drawX - 20}
            y={drawY - 20}
            width={width + 40}
            height={height + 40}
            fill="none"
            stroke="#999"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
        )}

        {/* Main Outer Frame */}
        <rect
          x={drawX}
          y={frameY}
          width={width}
          height={actualFrameHeight}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2"
        />
        
        {/* Inner Frame Detail (Bevel) */}
        <rect
          x={drawX + 10}
          y={frameY + 10}
          width={width - 20}
          height={actualFrameHeight - 20}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Persiana Box */}
        {hasPersiana && (
          <g>
            <rect
              x={drawX}
              y={drawY}
              width={width}
              height={persianaHeight}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2"
            />
            {/* Horizontal lines for persiana texture */}
            {Array.from({ length: 8 }).map((_, i) => (
               <line 
                key={i}
                x1={drawX + 10} 
                y1={drawY + 20 + (i * 20)} 
                x2={drawX + width - 10} 
                y2={drawY + 20 + (i * 20)} 
                stroke={colors.stroke}
                opacity="0.5"
               />
            ))}
            <text x={drawX + width/2} y={drawY + persianaHeight/2} textAnchor="middle" fill={colors.stroke} opacity="0.3" fontSize="20">
                PERSIANA INTEGRADA
            </text>
          </g>
        )}

        {/* Sashes */}
        {renderSashes()}

        {/* Dimensions */}
        {renderDimension(width, false)}
        {renderDimension(height, true)}

        {/* Gap/Folga Indicator (Text only if gap exists) */}
        {config.gap > 0 && (
            <text x={drawX + width + 60} y={drawY} className="text-xs fill-red-500 font-bold">
                Folga: {config.gap}mm
            </text>
        )}

      </svg>
    </div>
  );
};

export default WindowPreview;