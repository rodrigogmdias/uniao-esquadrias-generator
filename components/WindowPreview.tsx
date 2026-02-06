import React, { useMemo } from 'react';
import { WindowConfig, WindowType } from '../types';
import { FINISH_COLORS_MAP, GLASS_COLORS } from '../constants';

interface WindowPreviewProps {
  config: WindowConfig;
}

const WindowPreview: React.FC<WindowPreviewProps> = ({ config }) => {
  const { width, height, finish, accessoryColor, type, hasContramarco, hasVeneziana, hasPersiana, glassType, productLine } = config;

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

  // Helper to render Venetian Slats pattern
  const renderSlats = (w: number, h: number) => {
    // Simple horizontal lines
    const slatCount = Math.floor(h / 30); // Slats every 30mm approx
    
    return (
      <g>
        {Array.from({ length: slatCount }).map((_, i) => (
          <line 
            key={i}
            x1="0" 
            y1={i * 30} 
            x2={w} 
            y2={i * 30} 
            stroke={colors.stroke} 
            strokeWidth="2"
            opacity="0.6"
          />
        ))}
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
    // --- Hinge Door (Giro 1 Leaf) ---
    if (type === WindowType.DOOR_HINGE_1_LEAF) {
       const sashWidth = width - (frameThick * 2);
       const sashHeight = actualFrameHeight - (frameThick); 
       
       // If veneziana, visualize as 50% open (split texture)
       const venetianWidth = hasVeneziana ? sashWidth * 0.5 : 0;

       return (
        <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
             {/* Base Glass Layer */}
             <rect
                width={sashWidth}
                height={sashHeight - frameThick}
                fill={glassColor}
                stroke={colors.stroke}
                strokeWidth="1"
             />
             
             {/* Venetian Layer (Partial if enabled) */}
             {hasVeneziana && (
               <g>
                 <rect
                    width={venetianWidth}
                    height={sashHeight - frameThick}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="1"
                 />
                 {renderSlats(venetianWidth, sashHeight - frameThick)}
                 {/* Divider Line */}
                 <line x1={venetianWidth} y1={0} x2={venetianWidth} y2={sashHeight - frameThick} stroke={colors.stroke} strokeWidth="2" />
               </g>
             )}

             {/* Sash Profile Frame */}
             <rect
                width={sashWidth}
                height={sashHeight - frameThick}
                fill="none"
                stroke={colors.fill}
                strokeWidth={sashThick * 1.5}
             />
             
             {/* Handle */}
             <rect 
                x={sashWidth - 80} 
                y={(sashHeight/2) - 10} 
                width={60} 
                height={20} 
                rx="4" 
                fill={accFill} 
                stroke={accStroke} 
                strokeWidth="1" 
             />

             {/* Opening Arc */}
             <path 
                d={`M0,0 L${sashWidth},${sashHeight/2} L0,${sashHeight}`} 
                fill="none" 
                stroke="#999" 
                strokeWidth="2" 
                strokeDasharray="15,10"
                opacity="0.7"
             />
        </g>
       )
    }

    // --- Hinge Door (Giro 2 Leaf) ---
    if (type === WindowType.DOOR_HINGE_2_LEAF) {
       const totalSashWidth = width - (frameThick * 2);
       const sashWidth = totalSashWidth / 2;
       const sashHeight = actualFrameHeight - (frameThick);

       // If veneziana, Left is Glass, Right is Venetian
       const leftIsVenetian = false;
       const rightIsVenetian = hasVeneziana;

       // Render Left Sash
       const leftSash = (
           <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
               <rect width={sashWidth} height={sashHeight - frameThick} fill={leftIsVenetian ? colors.fill : glassColor} stroke={colors.stroke} strokeWidth="1" />
               {leftIsVenetian && renderSlats(sashWidth, sashHeight - frameThick)}
               <rect width={sashWidth} height={sashHeight - frameThick} fill="none" stroke={colors.fill} strokeWidth={sashThick * 1.5} />
               <rect x={sashWidth - 50} y={(sashHeight/2) - 10} width={40} height={20} rx="4" fill={accFill} stroke={accStroke} strokeWidth="1" />
               <path d={`M0,0 L${sashWidth},${sashHeight/2} L0,${sashHeight}`} fill="none" stroke="#999" strokeWidth="2" strokeDasharray="15,10" opacity="0.7" />
           </g>
       );

       // Render Right Sash
       const rightSash = (
           <g transform={`translate(${drawX + frameThick + sashWidth}, ${frameY + frameThick})`}>
               <rect width={sashWidth} height={sashHeight - frameThick} fill={rightIsVenetian ? colors.fill : glassColor} stroke={colors.stroke} strokeWidth="1" />
               {rightIsVenetian && renderSlats(sashWidth, sashHeight - frameThick)}
               <rect width={sashWidth} height={sashHeight - frameThick} fill="none" stroke={colors.fill} strokeWidth={sashThick * 1.5} />
               <rect x={10} y={(sashHeight/2) - 10} width={40} height={20} rx="4" fill={accFill} stroke={accStroke} strokeWidth="1" />
               <path d={`M${sashWidth},0 L0,${sashHeight/2} L${sashWidth},${sashHeight}`} fill="none" stroke="#999" strokeWidth="2" strokeDasharray="15,10" opacity="0.7" />
           </g>
       );

       return <>{leftSash}{rightSash}</>;
    }

    // --- Maxim-Ar ---
    if (type === WindowType.MAXIM_AR) {
      const sashWidth = width - (frameThick * 2);
      const sashHeight = actualFrameHeight - (frameThick * 2);
      
      // Vertical split if Venetian: Top half Venetian, Bottom half Glass
      const venetianHeight = hasVeneziana ? sashHeight * 0.5 : 0;

      return (
        <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
          {/* Base Glass */}
          <rect
            width={sashWidth}
            height={sashHeight}
            fill={glassColor}
            stroke={colors.stroke}
            strokeWidth="4"
          />
          
          {/* Venetian Layer */}
          {hasVeneziana && (
            <g>
                <rect width={sashWidth} height={venetianHeight} fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
                {renderSlats(sashWidth, venetianHeight)}
                <line x1={0} y1={venetianHeight} x2={sashWidth} y2={venetianHeight} stroke={colors.stroke} strokeWidth="2" />
            </g>
          )}

           <rect
            x={0} y={0}
            width={sashWidth}
            height={sashHeight}
            fill="none"
            stroke={colors.fill}
            strokeWidth={sashThick}
          />
           <polyline 
             points={`0,${sashHeight} ${sashWidth/2},0 ${sashWidth},${sashHeight}`} 
             fill="none" 
             stroke="#999" 
             strokeWidth="2" 
             strokeDasharray="15,10"
             opacity="0.7"
           />
           <circle cx={sashWidth/2} cy={sashHeight - 20} r="6" fill={accFill} stroke={accStroke} strokeWidth="1" />
           {renderArrow(sashWidth / 2, sashHeight / 2, 'down')}
        </g>
      );
    }

    // --- Sliding 2 Leaf ---
    if (type === WindowType.SLIDING_2_LEAF || type === WindowType.DOOR_SLIDING_2_LEAF) {
      const overlap = 20;
      const leafWidth = (width - (frameThick * 2)) / 2 + overlap;
      const leafHeight = actualFrameHeight - (frameThick * 2);
      
      const isDoor = type === WindowType.DOOR_SLIDING_2_LEAF;
      const localSashThick = isDoor ? sashThick * 1.3 : sashThick; 
      
      // Venetian Logic: Left Leaf is Glass, Right Leaf is Venetian
      const leftIsVenetian = false; 
      const rightIsVenetian = hasVeneziana;

      // Left Leaf (Back) - Glass
      const leftLeaf = (
        <g transform={`translate(${drawX + frameThick}, ${frameY + frameThick})`}>
          <rect width={leafWidth} height={leafHeight} fill={leftIsVenetian ? colors.fill : glassColor} stroke={colors.stroke} strokeWidth="1" />
           {leftIsVenetian && renderSlats(leafWidth, leafHeight)}
           <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={localSashThick} />
           {!leftIsVenetian && <path d={`M${leafWidth * 0.2},${leafHeight * 0.2} L${leafWidth * 0.8},${leafHeight * 0.8}`} stroke="white" strokeWidth="2" opacity="0.3" />}
           {renderArrow(leafWidth / 2, leafHeight / 2, 'right')}
        </g>
      );

      // Right Leaf (Front) - Venetian (if enabled)
      const rightLeaf = (
        <g transform={`translate(${drawX + frameThick + leafWidth - (overlap * 2)}, ${frameY + frameThick})`}>
          <rect x="-5" y="0" width={leafWidth} height={leafHeight} fill="black" opacity="0.1" />
          <rect width={leafWidth} height={leafHeight} fill={rightIsVenetian ? colors.fill : glassColor} stroke={colors.stroke} strokeWidth="1" />
           {rightIsVenetian && renderSlats(leafWidth, leafHeight)}
           <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={localSashThick} />
           <rect x={10} y={leafHeight/2 - 20} width={8} height={40} rx="4" fill={accFill} stroke={accStroke} strokeWidth="1" />
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

    // --- Sliding 4 Leaf ---
    if (type === WindowType.SLIDING_4_LEAF || type === WindowType.DOOR_SLIDING_4_LEAF) {
        const overlap = 20;
        const totalInteriorWidth = width - (frameThick * 2);
        const leafWidth = (totalInteriorWidth / 4) + overlap;
        const leafHeight = actualFrameHeight - (frameThick * 2);
        
        const isDoor = type === WindowType.DOOR_SLIDING_4_LEAF;
        const localSashThick = isDoor ? sashThick * 1.3 : sashThick;

        return Array.from({length: 4}).map((_, i) => {
             const xPos = drawX + frameThick + (i * (leafWidth - overlap));
             const isCenter = i === 1 || i === 2;
             
             // Venetian Logic: Outer leaves (0, 3) are Venetian, Inner leaves (1, 2) are Glass
             // This gives the "open in center" look
             const isVenetianLeaf = hasVeneziana && (i === 0 || i === 3);

             return (
                <g key={i} transform={`translate(${xPos}, ${frameY + frameThick})`}>
                    <rect width={leafWidth} height={leafHeight} fill={isVenetianLeaf ? colors.fill : glassColor} stroke={colors.stroke} strokeWidth="1" />
                    {isVenetianLeaf && renderSlats(leafWidth, leafHeight)}
                    <rect width={leafWidth} height={leafHeight} fill="none" stroke={colors.fill} strokeWidth={localSashThick} />
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