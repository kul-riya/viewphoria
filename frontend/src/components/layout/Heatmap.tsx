    import React, { useState } from 'react';

    
    const SnapshotMetadataHeatmap = () => {
      // Sample data based on the SnapshotMeta model
      const [snapshots, setSnapshots] = useState([
        {
          snapshot_id: "snapsnapsnapsnapsnap-001",
          timestamp: 1711642800, // 2025-03-29 00:00:00
          operation: "Append",
          added_files: 145,
          total_size_bytes: 1258291200,
          total_records: 3500000,
          changed_partition_count: 12,
          deleted_files: 0,
          modified_files: 0
        },
        {
          snapshot_id: "snap-002",
          timestamp: 1711729200, // 2025-03-30 00:00:00
          operation: "Overwrite",
          added_files: 67,
          total_size_bytes: 876543210,
          total_records: 2100000,
          changed_partition_count: 8,
          deleted_files: 120,
          modified_files: 35
        },
        {
          snapshot_id: "snap-003",
          timestamp: 1711815600, // 2025-03-31 00:00:00
          operation: "Append",
          added_files: 89,
          total_size_bytes: 456789012,
          total_records: 1800000,
          changed_partition_count: 5,
          deleted_files: 0,
          modified_files: 0
        },
        {
          snapshot_id: "snap-004",
          timestamp: 1711902000, // 2025-04-01 00:00:00
          operation: "Merge",
          added_files: 42,
          total_size_bytes: 234567890,
          total_records: 900000,
          changed_partition_count: 10,
          deleted_files: 15,
          modified_files: 28
        },
        {
          snapshot_id: "snap-005",
          timestamp: 1711988400, // 2025-04-02 00:00:00
          operation: "Append",
          added_files: 156,
          total_size_bytes: 1987654321,
          total_records: 4200000,
          changed_partition_count: 15,
          deleted_files: 0,
          modified_files: 0
        }
      ]);

      // Select which metrics to display in the heatmap
      const [selectedMetrics, setSelectedMetrics] = useState([
        'added_files',
        'total_size_bytes',
        'total_records',
        'changed_partition_count',
        'deleted_files',
        'modified_files'
      ]);

      // Configuration options
      const [config, setConfig] = useState({
        colorLow: '#a66df2',   // Light blue for low values
        colorHigh: '#530bb3',  // Dark blue for high values
        showValues: true,
        normalizeByColumn: true, // Whether to normalize values by column (metric)
      });

      // Format large numbers for display
      const formatNumber = (value, metric) => {
        if (metric === 'total_size_bytes') {
          // Convert bytes to MB or GB for readability
          if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)} GB`;
          } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)} MB`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(2)} KB`;
          }
          return `${value} B`;
        } else if (metric === 'total_records') {
          // Format large record counts
          if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
          } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(1)}K`;
          }
        }
        return value.toLocaleString();
      };

      // Function to get date from timestamp
      const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toISOString().split('T')[0];
      };

      // Calculate min and max values for each metric
      const metricRanges = {};
      selectedMetrics.forEach(metric => {
        const values = snapshots.map(snapshot => snapshot[metric] || 0);
        metricRanges[metric] = {
          min: Math.min(...values),
          max: Math.max(...values)
        };
      });

      // Function to get color based on value
      const getColor = (value, metric) => {
        // If value is 0 or undefined, use a very light gray
        if (value === 0 || value === undefined) {
          return "#f5f5f5";
        }
        
        let ratio;
        if (config.normalizeByColumn) {
          // Normalize by column (within each metric)
          const range = metricRanges[metric];
          // Avoid division by zero
          if (range.max === range.min) {
            ratio = 1;
          } else {
            ratio = (value - range.min) / (range.max - range.min);
          }
        } else {
          // Find global min and max across all metrics
          const allValues = snapshots.flatMap(snapshot => 
            selectedMetrics.map(metric => snapshot[metric] || 0)
          );
          const globalMin = Math.min(...allValues);
          const globalMax = Math.max(...allValues);
          
          ratio = (value - globalMin) / (globalMax - globalMin);
        }
        
        // Calculate RGB components
        const r1 = parseInt(config.colorLow.slice(1, 3), 16);
        const g1 = parseInt(config.colorLow.slice(3, 5), 16);
        const b1 = parseInt(config.colorLow.slice(5, 7), 16);
        
        const r2 = parseInt(config.colorHigh.slice(1, 3), 16);
        const g2 = parseInt(config.colorHigh.slice(3, 5), 16);
        const b2 = parseInt(config.colorHigh.slice(5, 7), 16);
        
        const r = Math.round(r1 + ratio * (r2 - r1));
        const g = Math.round(g1 + ratio * (g2 - g1));
        const b = Math.round(b1 + ratio * (b2 - b1));
        
        return `rgb(${r}, ${g}, ${b})`;
      };

      // Determine text color based on background brightness
      const textColor = (bgColor) => {
        if (bgColor === "#f5f5f5") return "black";
        
        // Extract RGB values
        const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return "black";
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        // Calculate brightness using a common formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        return brightness > 128 ? "black" : "white";
      };

      // Format metric names for display
      const formatMetricName = (metric) => {
        return metric
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      return (
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Snapshot Metadata Heatmap</h1>
          
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={config.showValues}
                onChange={e => setConfig({...config, showValues: e.target.checked})}
                className="mr-2"
              />
              <label>Show Values</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={config.normalizeByColumn}
                onChange={e => setConfig({...config, normalizeByColumn: e.target.checked})}
                className="mr-2"
              />
              <label>Normalize By Metric</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <label>Low:</label>
              <input 
                type="color" 
                value={config.colorLow}
                onChange={e => setConfig({...config, colorLow: e.target.value})}
                className="p-1 border rounded"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label>High:</label>
              <input 
                type="color" 
                value={config.colorHigh}
                onChange={e => setConfig({...config, colorHigh: e.target.value})}
                className="p-1 border rounded"
              />
            </div>
          </div>
          
          {/* Heatmap */}
          <div className="overflow-x-auto w-full">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th className="p-2bg-gray-400/40 max-w-10">Snapshot ID</th>
                  {/* <th className="p-2 border border-gray-300 bg-gray-100">Date</th> */}
                  {/* <th className="p-2 border border-gray-300 bg-gray-100">Operation</th> */}
                  {selectedMetrics.map(metric => (
                    <th key={metric} className="p-2  bg-gray-400/40 ">
                      {formatMetricName(metric)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshots.map((snapshot) => (
                  <tr key={snapshot.snapshot_id}>
                    <td className="p-2  font-medium overflow-auto max-w-20">{snapshot.snapshot_id}</td>
                    {/* <td className="p-2 border border-gray-300">{formatDate(snapshot.timestamp)}</td> */}
                    {/* <td className="p-2 border border-gray-300">{snapshot.operation}</td> */}
                    {selectedMetrics.map(metric => {
                      const value = snapshot[metric] || 0;
                      const backgroundColor = getColor(value, metric);
                      const color = textColor(backgroundColor);
                      
                      return (
                        <td 
                          key={`${snapshot.snapshot_id}-${metric}`}
                          style={{ backgroundColor, color }}
                          className="p-2 text-center max-w-10"
                        >
                          {config.showValues ? formatNumber(value, metric) : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Metrics to Display</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['added_files', 'total_size_bytes', 'total_records', 'changed_partition_count', 'deleted_files', 'modified_files'].map(metric => (
                <div key={metric} className="flex items-center">
                  <input 
                    type="checkbox"
                    id={`metric-${metric}`} 
                    checked={selectedMetrics.includes(metric)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric]);
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`metric-${metric}`}>{formatMetricName(metric)}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    export default SnapshotMetadataHeatmap;


