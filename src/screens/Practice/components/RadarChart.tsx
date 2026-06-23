/**
 * RadarChart Component
 * Custom triangle radar chart using react-native-svg
 * Shows balance between MCQ, Comprehension, Writing
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';

// ============================================================================
// PROPS
// ============================================================================

interface RadarChartProps {
  mcq:           number;
  comprehension: number;
  writing:       number;
  max?:          number;
  size?:         number;
}

// ============================================================================
// HELPERS
// ============================================================================

const toRad = (deg: number) => (deg * Math.PI) / 180;

// 3 axes at 90°, 210°, 330° (equilateral triangle pointing up)
const AXES = [
  { angle: 90,  label: 'MCQ'           },
  { angle: 210, label: 'Comprehension' },
  { angle: 330, label: 'Writing'       },
];

const getPoint = (
  cx:     number,
  cy:     number,
  radius: number,
  angle:  number,
): { x: number; y: number } => ({
  x: cx + radius * Math.cos(toRad(angle - 90)),
  y: cy + radius * Math.sin(toRad(angle - 90)),
});

// ============================================================================
// COMPONENT
// ============================================================================

const RadarChart: React.FC<RadarChartProps> = ({
  mcq,
  comprehension,
  writing,
  max  = 30,
  size = 220,
}) => {
  const cx       = size / 2;
  const cy       = size / 2;
  const maxR     = size * 0.35; // max radius
  const labelR   = size * 0.46; // label radius

  const values   = [mcq, comprehension, writing];

  // Grid levels (25%, 50%, 75%, 100%)
  const levels   = [0.25, 0.5, 0.75, 1.0];

  // Outer axis points (100%)
  const axisPoints = AXES.map(a => getPoint(cx, cy, maxR, a.angle));

  // Data polygon points
  const dataPoints = AXES.map((a, i) => {
    const ratio = max > 0 ? values[i] / max : 0;
    return getPoint(cx, cy, maxR * ratio, a.angle);
  });

  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid polygons
  const gridPolygons = levels.map(level =>
    AXES.map(a => getPoint(cx, cy, maxR * level, a.angle))
        .map(p => `${p.x},${p.y}`)
        .join(' ')
  );

  // Label positions
  const labelPoints = AXES.map(a => getPoint(cx, cy, labelR, a.angle));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Balance Overview</Text>

      <Svg width={size} height={size}>

        {/* Grid polygons */}
        {gridPolygons.map((points, i) => (
          <Polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisPoints.map((point, i) => (
          <Line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon */}
        <Polygon
          points={dataPolygon}
          fill="rgba(108, 77, 255, 0.15)"
          stroke="#6C4DFF"
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <Circle
            key={`dot-${i}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="#6C4DFF"
          />
        ))}

        {/* Labels */}
        {labelPoints.map((point, i) => (
          <SvgText
            key={`label-${i}`}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={11}
            fontWeight="600"
            fill="#475569"
          >
            {AXES[i].label}
          </SvgText>
        ))}

      </Svg>

      {/* Tip */}
      <View style={styles.tipRow}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          Adjust the sliders to focus on your weak areas or build on your strengths.
        </Text>
      </View>

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    alignItems:   'center',
    marginTop:    8,
    marginBottom: 4,
  },
  title: {
    fontSize:     14,
    fontWeight:   '700',
    color:        '#0F172A',
    marginBottom: 8,
  },
  tipRow: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    backgroundColor:   '#F8FAFC',
    borderRadius:      10,
    padding:           10,
    marginTop:         8,
    marginHorizontal:  16,
    gap:               8,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipText: {
    flex:       1,
    fontSize:   12,
    color:      '#475569',
    lineHeight: 18,
  },
});

export default RadarChart;