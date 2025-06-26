interface GraphHeaderProps {
  branches: string[];
  branchCount: number;
}

export const GraphHeader = ({ branches, branchCount }: GraphHeaderProps) => (
  <div
    className="grid sticky top-0 z-10 bg-white"
    style={{
      gridTemplateColumns: `100px repeat(${branchCount}, 1fr)`,
      height: 40,
    }}
  >
    <div className="font-semibold border-b border-gray-300 bg-gray-50 flex items-center justify-center" />
    {branches.map(br => (
      <div
        key={br}
        className="min-w-28 font-semibold text-center px-2 py-1 border-b border-gray-300 bg-gray-50 flex items-center justify-center"
      >
        {br}
      </div>
    ))}
  </div>
);
