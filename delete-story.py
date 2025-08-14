import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'capstone-story-project'
    
    try:
        if 'body' in event and event['body']:
            body = json.loads(event['body'])
            filename = body.get('filename')
        else:
            filename = event.get('filename')
        
        if not filename:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'filename required'})
            }
        
        # Check if file exists first
        try:
            s3.head_object(Bucket=bucket_name, Key=filename)
        except s3.exceptions.NoSuchKey:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'File not found'})
            }
        
        # Delete the file
        s3.delete_object(Bucket=bucket_name, Key=filename)
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Story deleted successfully',
                'filename': filename
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }